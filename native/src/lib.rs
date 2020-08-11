use neon::prelude::*;
use serde_derive::{Deserialize, Serialize};

struct WriterWrapper<'a, W: std::io::Write + 'a> {
    w: &'a mut W,
}
impl<'a, W: std::io::Write + 'a> std::io::Write for WriterWrapper<'a, W> {
    fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
        self.w.write(&buf)
    }

    fn flush(&mut self) -> std::io::Result<()> {
        self.w.flush()
    }
}
#[derive(Serialize, Deserialize, Debug)]
struct FitOption {
    width: Option<u32>,
    height: Option<u32>,
    zoom: Option<f32>,
}

fn render_svg(mut cx: FunctionContext) -> JsResult<JsBuffer> {
    let svg_string = cx.argument::<JsString>(0)?.value();
    let svg_tree = match usvg::Tree::from_str(&svg_string, &usvg::Options::default()) {
        Ok(tree) => tree,
        Err(_) => panic!("Failed to parse svg string"),
    };
    let mut fit = usvg::FitTo::Original;
    match cx.argument_opt(1) {
        Some(arg) => {
            let option: FitOption = neon_serde::from_value(&mut cx, arg)?;
            match option.height {
                Some(num) => fit = usvg::FitTo::Height(num),
                None => (),
            }
            match option.width {
                Some(num) => fit = usvg::FitTo::Width(num),
                None => (),
            }
            match option.zoom {
                Some(num) => fit = usvg::FitTo::Zoom(num),
                None => (),
            }
        }
        None => {}
    }
    if let Some(img) = resvg::render(&svg_tree, fit, None) {
        let mut buf: Vec<u8> = Vec::new();
        {
            let mut wrapper = WriterWrapper { w: &mut buf };
            let mut encoder = png::Encoder::new(&mut wrapper, img.width(), img.height());
            encoder.set_color(png::ColorType::RGBA);
            encoder.set_depth(png::BitDepth::Eight);
            let mut writer = encoder.write_header().unwrap();
            writer.write_image_data(img.data()).unwrap();
        }
        let mut js_buffer = cx.buffer(buf.len() as u32)?;
        cx.borrow_mut(&mut js_buffer, |data| {
            let slice = data.as_mut_slice::<u8>();
            for i in 0..slice.len() {
                slice[i] = buf[i];
            }
        });
        return Ok(js_buffer);
    } else {
        panic!("No result");
    }
}

register_module!(mut cx, { cx.export_function("renderSvg", render_svg) });

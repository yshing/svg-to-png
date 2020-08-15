const svg2png = require("../lib")

const simpleSvg = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 24.2.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 2 2" style="enable-background:new 0 0 2 2;" xml:space="preserve">
<rect x="0" y="0" style="stroke:#000000;stroke-miterlimit:10;" width="2" height="2"/>
</svg>
`
const svgHkFlag = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generator: Adobe Illustrator 24.2.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="900" height="600">
	<rect width="900" height="600" fill="#de2910"/>
	<g id="petal">
		<path d="m 449.96406,299.9134 c -105.26305,-44.48626 -58.60174,-181.58185 42.06956,-174.6907 -20.36609,10.46694 -23.31775,29.99772 -11.68704,48.09021 13.02444,20.2558 -1.19897,52.84856 -18.80577,60.7674 -28.93485,13.02443 -34.72791,47.74999 -11.57675,65.83309 z" fill="#fff"/>
		<path d="m 444.27188,200.91974 -5.91976,9.29378 -2.14454,-10.8142 -10.67812,-2.75928 9.62461,-5.3895 -0.67104,-10.99955 8.08542,7.48945 10.25578,-4.04271 -4.61053,10.00942 7.00143,8.50541 z" fill="#de2910"/>
		<path d="m 450.56002,298.75902 c -12.73114,-6.53451 -22.9963,-20.15491 -27.46839,-36.43134 -5.11498,-18.66969 -2.17269,-38.74247 8.08308,-55.03768 l -2.20789,-1.39371 c -10.64057,16.92871 -13.69313,37.74293 -8.38575,57.11886 4.72784,17.22201 15.21355,31.09815 28.78703,38.06438 z" fill="#de2910"/>
	</g>
    <use xlink:href="#petal" transform="rotate(72 450,300)"/>
	<use xlink:href="#petal" transform="rotate(144 450,300)"/>
	<use xlink:href="#petal" transform="rotate(216 450,300)"/>
	<use xlink:href="#petal" transform="rotate(288 450,300)"/>
</svg>
`
const invalidSvg = `
INVALIDTOKEN
<svg version="1.1" id="layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 2 2" style="enable-background:new 0 0 2 2;" xml:space="preserve">
<rect x="0" y="0" style="stroke:#000000;stroke-miterlimit:10;" width="2" height="2"/>
</svg>
`

describe("svg2png", ()=>{
    test("properly render the simple svg", () => {
        expect(svg2png(simpleSvg)).toMatchSnapshot()
    })
    test("properly render ", () => {
        expect(svg2png(simpleSvg, {width: 4})).toMatchSnapshot()
    })
    test("properly render the HK flag", () => {
        expect(svg2png(svgHkFlag, {width: 30})).toMatchSnapshot()
    })
    test("properly report svg parse error", () => {
        expect(()=>svg2png(invalidSvg)).toThrowErrorMatchingSnapshot()
    })
})

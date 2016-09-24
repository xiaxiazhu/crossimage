var CrossImage = module.exports;

// CrossImage.getFitUrl(src,width,height,config,isForce)

describe('CrossImage', () => {
    it('should add rule with setup width and height', () => {
        var img = 'http://gi2.md.alicdn.com/bao/uploadedi4/1804033223/T2nFegXFVaXXXXXXXX_!!1804033223.jpg';
        CrossImage.getFitUrl(img, 150, 150, {}).should.equal('http://img.alicdn.com/bao/uploadedi4/1804033223/T2nFegXFVaXXXXXXXX_!!1804033223.jpg_300x1000Q30s50.jpg_.webp')
    })

    it('should be removed suffix and add rule', () => {
        var img = 'https://img.alicdn.com/tps/i3/TB1z5R9LXXXXXa5XFXXpu65FpXX-22-26.png_Q60.jpg_.webp';

        CrossImage.getFitUrl(img).should.equal('https://img.alicdn.com/tps/i3/TB1z5R9LXXXXXa5XFXXpu65FpXX-22-26.png_2200x2200Q50.jpg_.webp')
    })

    it('should be dont add rule on git file', () => {
        var img = 'https://img.alicdn.com/tps/i2/TB1ybRMHXXXXXb1aXXXuUfPHFXX-60-42.gif';

        CrossImage.getFitUrl(img).should.equal('https://img.alicdn.com/tps/i2/TB1ybRMHXXXXXb1aXXXuUfPHFXX-60-42.gif');
    })

    it('should be dont add rule on svg file', () => {
        var img = 'https://img.alicdn.com/tps/i2/TB1ybRMHXXXXXb1aXXXuUfPHFXX-60-42.svg';

        CrossImage.getFitUrl(img).should.equal('https://img.alicdn.com/tps/i2/TB1ybRMHXXXXXb1aXXXuUfPHFXX-60-42.svg')
    })

    it('should be force add rule on each file', () => {
        var img = 'https://img.alicdn.com/tps/i2/TB1ybRMHXXXXXb1aXXXuUfPHFXX-60-42.gif';

        CrossImage.getFitUrl(img, null, null, {}, true).should.equal('https://img.alicdn.com/tps/i2/TB1ybRMHXXXXXb1aXXXuUfPHFXX-60-42.gif_2200x2200Q50s50.jpg_.webp')
    })
})

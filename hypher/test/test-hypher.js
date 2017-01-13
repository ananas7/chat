const chai = require('chai');
const assert = chai.assert;
const hypher = require('../index.js');
const textEn = "Surround the text in English language. It is - an example of a dash. AVE, Paris, height, makes, anybody, kindness, graffiti, beeline.";
const hypherTextEn = "Sur\u00ADround the text in Eng\u00ADlish lan\u00ADguage. It is - an ex\u00ADam\u00ADple of a dash. AVE, Paris, height, makes, any\u00ADbody, kind\u00ADness, graf\u00ADfiti, bee\u00ADline.";
const textRu = "Некоторый текст на русском. Это - пример тире. ТПП, любовь, разыскать, подъезд, война, акация, подбить, прислать, пятиграммовый, жужжать, спецодежда.";
const hypherTextRu = "Неко\u00ADто\u00ADрый текст на рус\u00ADском. Это - при\u00ADмер ти\u00ADре. ТПП, лю\u00ADбовь, разыс\u00ADкать, подъ\u00ADезд, вой\u00ADна, ака\u00ADция, под\u00ADбить, при\u00ADслать, пя\u00ADти\u00ADграм\u00ADмо\u00ADвый, жуж\u00ADжать, спец\u00ADодеж\u00ADда.";
const textRuEn = "Некоторый text contain mixed содержимое.";
const hypherTextRuEn = "Неко\u00ADто\u00ADрый text con\u00ADtain mixed со\u00ADдер\u00ADжи\u00ADмое.";
const htmlEn = "<div>Surround the text in English language. It is - an example of a dash. <span>AVE, Paris, height, makes, anybody, kindness, graffiti, beeline.</span></div>";
const hypherHtmlEn = "<div>Sur\u00ADround the text in Eng\u00ADlish lan\u00ADguage. It is - an ex\u00ADam\u00ADple of a dash. <span>AVE, Paris, height, makes, any\u00ADbody, kind\u00ADness, graf\u00ADfiti, bee\u00ADline.</span></div>";
const htmlRu = "<div>Некоторый текст на русском. Это - пример тире. <span>ТПП, любовь, разыскать, подъезд, война, акация, подбить, прислать, пятиграммовый, жужжать, спецодежда.</span></div>";
const hypherHtmlRu = "<div>Неко\u00ADто\u00ADрый текст на рус\u00ADском. Это - при\u00ADмер ти\u00ADре. <span>ТПП, лю\u00ADбовь, разыс\u00ADкать, подъ\u00ADезд, вой\u00ADна, ака\u00ADция, под\u00ADбить, при\u00ADслать, пя\u00ADти\u00ADграм\u00ADмо\u00ADвый, жуж\u00ADжать, спец\u00ADодеж\u00ADда.</span></div>";
const htmlRuEn = "<div>Некоторый text contain mixed содержимое.</div>";
const hypherHtmlRuEn = "<div>Неко\u00ADто\u00ADрый text con\u00ADtain mixed со\u00ADдер\u00ADжи\u00ADмое.</div>";
const htmlWithSymbolInText = "<pre>It's code &shy; don't must disappear</pre>";
const hypherHtmlWithSymbolInText = "<pre>It's code &shy; don't must dis\u00ADap\u00ADpear</pre>";

describe('Test hypher', function () {
    describe('hyphenation text and html', function () {
        it('text in en', function() {
            assert.equal(hypher.hyph(textEn), hypherTextEn);
        });
        it('text in ru', function() {
            assert.equal(hypher.hyph(textRu), hypherTextRu);
        });
        it('text in mixed ru and en', function() {
            assert.equal(hypher.hyph(textRuEn), hypherTextRuEn);
        });
        it('html with text in en', function() {
            assert.equal(hypher.hyph(htmlEn), hypherHtmlEn);
        });
        it('html with text in ru', function() {
            assert.equal(hypher.hyph(htmlRu), hypherHtmlRu);
        });
        it('html with text in mixed ru and en', function() {
            assert.equal(hypher.hyph(htmlRuEn), hypherHtmlRuEn);
        });
        it('html with text contain &shy;', function() {
            assert.equal(hypher.hyph(htmlWithSymbolInText), hypherHtmlWithSymbolInText);
        });
    });
    describe('unhyphenation text and html', function () {
        it('text in en', function() {
            assert.equal(hypher.unhyph(hypherTextEn), textEn);
        });
        it('text in ru', function() {
            assert.equal(hypher.unhyph(hypherTextRu), textRu);
        });
        it('text in mixed ru and en', function() {
            assert.equal(hypher.unhyph(hypherTextRuEn), textRuEn);
        });
        it('html with text in en', function() {
            assert.equal(hypher.unhyph(hypherHtmlEn), htmlEn);
        });
        it('html with text in ru', function() {
            assert.equal(hypher.unhyph(hypherHtmlRu), htmlRu);
        });
        it('html with text in mixed ru and en', function() {
            assert.equal(hypher.unhyph(hypherHtmlRuEn), htmlRuEn);
        });
        it('html with text contain &shy;', function() {
            assert.equal(hypher.unhyph(hypherHtmlWithSymbolInText), htmlWithSymbolInText);
        });
    });
});
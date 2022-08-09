import DOMPurify from "dompurify";

const purify = function (dirty) {
    return DOMPurify.sanitize(dirty)
}

export default purify
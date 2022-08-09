import DOMPurify from "dompurify";

export default (dirty) => {
    return DOMPurify.sanitize(dirty)
}
import { imgPrefix } from './url';
const handleImgUrl = (url, preffix = imgPrefix, suffix) => {
    if (url === '' || url === null || url === undefined || url.indexOf('http') >= 0) return url;
    if (!suffix) suffix = '';
    return preffix + url + suffix;
};

export {
    handleImgUrl
};

const pageTitle = '有象视频-全球领先的新城镇在线视频平台';
/* 新城镇页面下的城市（轮播图下方带左右箭头可以滚动的）一页 显示的数量 */
const PAGE_SHOW_NUM = 9;
const sortBysort = (banners) => {
    return banners && banners.sort((banner1, banner2) => {
        return banner1.sort - banner2.sort;
    });
};

export {
    pageTitle,
    sortBysort,
    PAGE_SHOW_NUM
};

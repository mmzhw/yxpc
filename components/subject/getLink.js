const getLink = (item) => {
    if (!item) {
        return {
            key: item.videoBaseId,
            href: ``
        };
    }
    if (item.url) {
        return {
            href: item.url,
            as: item.url
        };
    }
    if (item.categories === 1) {
        return {
            as: `/play/${item.videoBaseId}`,
            href: `/play?baseId=${item.videoBaseId}`
        };
    } else {
        if (item.videoDetailId) {
            return {
                as: `/play/${item.videoBaseId}/${item.videoDetailId}`,
                href: `/play?baseId=${item.videoBaseId}&detailId=${item.videoDetailId}`
            };
        }
        return {
            as: `/play/${item.videoBaseId}`,
            href: `/play?baseId=${item.videoBaseId}&detailId=${item.videoDetailId}`
        };
    }
};
export default getLink;

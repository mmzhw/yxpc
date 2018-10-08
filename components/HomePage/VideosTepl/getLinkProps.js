const getLinkProps = (video) => {
    if (!video) {
        return {
            key: video.videoBaseId,
            href: ``
        };
    }
    if (video.url) {
        return {
            key: video.videoBaseId,
            as: video.url,
            href: video.url,
        };
    }
    if (video.categories === 1) {
        return {
            key: video.videoBaseId,
            as: `/play/${video.videoBaseId}`,
            href: `/play?baseId=${video.videoBaseId}`
        };
    } else {
        if (video.detailId) {
            return {
                key: video.videoBaseId,
                as: `/play/${video.videoBaseId}/${video.detailId}`,
                href: `/play?baseId=${video.videoBaseId}&detailId=${video.detailId}`
            };
        }
        return {
            key: video.videoBaseId,
            as: `/play/${video.videoBaseId}`,
            href: `/play?baseId=${video.videoBaseId}&detailId=${video.detailId}`
        };
    }
};

export default getLinkProps;

export default function (fn, threshold) {
    let last;
    let timer;

    return function(...args) {
        const context = this;

        if (last && Date.now() < last + threshold) {
            // 没到那个时间先不执行
            clearTimeout(timer);

            timer = setTimeout(() => {
                last = Date.now();
                fn.apply(context, args);
            }, threshold);
        } else {
            // 先执行一次
            last = Date.now();
            fn.apply(context, args);
        }
    };
}

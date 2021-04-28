
// redirect user depending on the using device

export default function (ctx) {

    const userAgent = navigator.userAgent
    const isMobile = /mobile/i.test(userAgent)
    const isMobilePage = ctx.route.fullPath === '/mobile'


    // detect mobile device and redirect

    if (isMobile && !isMobilePage) {
        ctx.redirect('/mobile')
    }

    // keep it in desktop version

    else if (!isMobile && isMobilePage) {
        ctx.redirect('/start')
    }
}

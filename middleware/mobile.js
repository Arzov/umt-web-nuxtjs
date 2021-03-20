export default function (ctx) {
    const userAgent = navigator.userAgent
    const isMobile = /mobile/i.test(userAgent)
    const isMobilePage = ctx.route.fullPath === '/mobile'

    if (isMobile && !isMobilePage) {
        ctx.redirect('/mobile')
    } else if (!isMobile && isMobilePage) { ctx.redirect('/start') }
}

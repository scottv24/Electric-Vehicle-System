/*   ⌄⌄⌄ CHANGE WHEN ENV PUTTING INTO PROD  ⌄⌄⌄    */

const env = "PROD"
//const env = 'DEV'

/*   ^^^ CHANGE WHEN ENV PUTTING INTO PROD ^^^     */

export const frontendURL = env === 'DEV' ? '/hwcharging/' : '/'

export const backendURL =
    env === 'DEV'
        ? 'http://localhost:3000'
        : window.location.origin.toString() + '/hwcharging'

export const rootURL = env === 'DEV' ? '/' : '/hwcharging'

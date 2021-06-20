import Vue from 'vue'
import UmtComponents from '@arzov/umt-components'
import '@arzov/umt-components/src/assets/styles/styles.css'


export default ({ store }) => {

    Vue.use(UmtComponents, {
        mode: 'desktop',
        store
    })

}

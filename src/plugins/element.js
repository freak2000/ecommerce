import Vue from 'vue'
// import { Button } from 'element-ui'
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// import { Message } from 'element-ui'
import ElementUI from 'element-ui'

Vue.use(ElementUI.Button)
Vue.use(ElementUI.Form)
Vue.use(ElementUI.FormItem)
Vue.use(ElementUI.Input)
Vue.prototype.$message = ElementUI.Message

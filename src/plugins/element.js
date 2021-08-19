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
Vue.use(ElementUI.Container)
Vue.use(ElementUI.Header)
Vue.use(ElementUI.Aside)
Vue.use(ElementUI.Main)
Vue.use(ElementUI.Menu)
Vue.use(ElementUI.MenuItem)
Vue.use(ElementUI.MenuItemGroup)
Vue.use(ElementUI.Submenu)
Vue.use(ElementUI.Breadcrumb)
Vue.use(ElementUI.BreadcrumbItem)
Vue.use(ElementUI.Card)
Vue.use(ElementUI.Col)
Vue.use(ElementUI.Row)
Vue.use(ElementUI.Table)
Vue.use(ElementUI.TableColumn)
Vue.use(ElementUI.Switch)
Vue.use(ElementUI.Tooltip)
Vue.use(ElementUI.Pagination)
Vue.use(ElementUI.Dialog)
Vue.use(ElementUI.Tag)
Vue.use(ElementUI.Tree)
Vue.use(ElementUI.Select)
Vue.use(ElementUI.Option)
// Vue.use(Element)
Vue.prototype.$message = ElementUI.Message
Vue.prototype.$confirm = ElementUI.MessageBox.confirm

# 网络请求

## 封装 axios 请求

```JavaScript
// http.js 这个文件是对axios请求插件的二次封装, 有的请求需要携带token，
// 可以把token携带的操作放在请求拦截的函数，也就是在发请求时候，先经过请求拦截追加token发给服务器，
// 也可以对服务器响应进行进行优化再返回给客户端 可以设置请求的服务器地址，也可以设置超时时间等。
import axios from "axios"; // 导入原始的请求插件

// 有些post接口无法解析对象类型的请求参数, 可以使用qs模块(node内置模块)把对象类型的数据序列化为
// 查询字符串结构 {name:lisi, age:10} ===> ?name=lisi&age=10
import qs from "qs"

// 请求数据时,展示请求的加载框, 使用element-plus组件库的加载组件
import { ElLoading } from 'element-plus'
let loading = null;


// 功能1 根据环境设置axios发起不同的服务器请求地址, 设置后,发起ajax请求不再拼接基础路径
if(process.env.NODE_ENV == "development"){
    axios.defaults.baseURL = "/dev-api"  // 开发环境的代理路径
}else if(process.env.NODE_ENV == "production"){
    axios.defaults.baseURL = "/prod-api"  // 生产环境的原始路径 (项目打包时用这个路径)
}

//功能2 添加超时功能 设置超时时间, 请求超过30秒无响应就判定请求失败
axios.defaults.timeout = 30000 //30s

// 功能3 是否允许跨域请求携带Cookie, 前端设置了该属性为true时，
// 后端需要设置Access-Control-Allow-Origin为前端项目的源地址，不可设置为*；
axios.defaults.withCredentials = true

// 功能4 在请求头设置(post)请求内容的编码格式
axios.defaults.headers["Content-Type"]="application/x-www-form-urlencoded"

// 功能5 把请求的参数由对象结构转化为查询字符串结构,  转换通过qs第三方进行转换  data就是请求参数
axios.defaults.transformRequest = data =>qs.stringify(data)

// 功能6 axios请求拦截 在发请求之前 对请求进行处理 一般把本地token添加到请求头里面执行登录认证,
// 这样在发请求时就不用考虑并处理token了
axios.interceptors.request.use(request=>{
    // 请求时开始加载, target参数指定加载框显示的区域
    if(!loading) loading = ElLoading.service({target:".refresh_box"})
    // console.log("axios请求拦截",request); // config参数是请求的配置信息
    let token = sessionStorage.getItem("token") //从本地取出token
    // 登录授权 请求验证是否有token  需要授权的 API ，
    // 必须在请求头中使用 `Authorization` 字段提供 `token` 令牌(具体字段由服务器后台定义)
    token && (request.headers.Authorization=token)
    return request
},error=>{
    return Promise.reject(error) // 返回错误
})

// 功能7 axios的响应拦截, 可在这里对响应数据或响应头做处理
axios.interceptors.response.use(response=>{
    if(loading) {      // 响应时结束加载
        loading.close();
        loading = null;
    }
    // axios响应数据会封装到一层data字段中, 把data字段剥开,返回原始响应
    return response.data
},error=>{
    return Promise.reject(error)
})

// 功能8 显示请求时的加载框, 见请求拦截和响应拦截

// 最后,返回配置之后的axios
export default axios
```

# 代码规范

## 一、Editorconfig

```Shell
# http://editorconfig.org 官网
# 实现不同开发工具下的代码风格一致
# EditorConfig helps maintain consistent coding styles for
# multiple developers working on the same project across various editors and IDEs.
root = true

[*] # 表示所有文件适用
charset = utf-8 # 设置文件字符集为 utf-8
indent_style = space # 缩进风格（tab | space）
indent_size = 2 # 缩进大小
end_of_line = lf # 控制换行类型(lf | cr | crlf)
trim_trailing_whitespace = true # 去除行尾的任意空白字符
insert_final_newline = true # 始终在文件末尾插入一个新行

[*.md] # 表示仅 md 文件适用以下规则
max_line_length = off
trim_trailing_whitespace = false
```

## 二、ESLint

> 官网：https://eslint.org/
>
> ESLint 是一个可配置的 JavaScript 检查器。它可以帮助你发现并修复 JavaScript 代码中的问题。问题可以指潜在的运行时漏洞、未使用最佳实践、风格问题等。

### 起步

- 安装

```Shell
# 直接安装并配置，根据需要，选择项目的eslint配置
npm init @eslint/config
```

- 配置

```JavaScript
{
    "rules":
        {
            "semi": ["error", "always"],
            "quotes": ["error", "double"]
        }
}
```

- 在项目中手动配置

```JavaScript
// 直接安装eslint
npm install eslint
// 创建eslintrc.js开始配置
```

### 配置

你可以根据你的情况定制 ESLint，它十分灵活且具可配置性。你可以关闭全部规则，只运行基本的语法验证，或者也可以根据项目需要，一起使用合适的捆绑规则与自定义规则。主要有两个配置 ESLint 的方法：

1. **配置注释 -** 在文件中使用 JavaScript 注释直接嵌入配置信息；
2. **配置文件** - 使用 JavaScript、JSON 或 YAML 文件指定整个目录及其所有子目录的配置信息。可以是.eslintrc.\*文件，也可以是 package.json 文件中是**eslintConfig**字段，ESLint 都会自动寻找并读取这个两处的配置，或者还可以用命令行上指定配置文件。

下面列出了一些 ESLint 中可配置的选项：

- **[Environments](https://eslint.org/docs/latest/use/configure/language-options#specifying-environments)** - 你的脚本被设计为在哪些环境下运行。每个环境都会附带一组预设的全局变量。
- **[Globals](https://eslint.org/docs/latest/use/configure/language-options#specifying-globals)** - 脚本在执行过程中需要用到的额外全局变量。
- **[Rules](https://eslint.org/docs/latest/use/configure/rules)** - 启用了哪些规则，它们又是什么级别错误水平
- **[Plugins](https://eslint.org/docs/latest/use/configure/plugins)** - 第三方插件为 ESLint 定义了额外的规则、环境、配置等。

所有这些选项使得你可以对 ESLint 处理代码的模式进行精准控制。

#### 配置文件格式

SLint 支持几种格式的配置文件：

**JavaScript** - 使用 `.eslintrc.js` 并导出包括配置的对象。 **JavaScript (ESM)** - 当在 JavaScript 包中运行 ESLint 时，且其 `package.json` 中指定 `"type":"module"` 时，使用 `.eslintrc.cjs`。请注意 ESLint 目前不支持 ESM 配置。 **YAML** - 使用 `.eslintrc.yaml` 或 `.eslintrc.yml` 来定义配置结构。 **JSON** - 使用 `.eslintrc.json` 来定义配置结构。ESLint JSON 文件中也可以使用 JavaScript 风格注释。 **package.json** - 在 `package.json` 文件中创建 `eslintConfig` 属性并在那里定义你的配置。

如果在同一目录下存在多个配置文件，ESLint 将按照以下优先顺序以此使用其一：

1. `.eslintrc.js`
2. `.eslintrc.cjs`
3. `.eslintrc.yaml`
4. `.eslintrc.yml`
5. `.eslintrc.json`
6. `package.json`

#### 配置规则

> 引用：https://blog.csdn.net/whl0071/article/details/126544501

一般配置规则，主要使用**rules**项来设置

ESLint 规则的三种级别：

- "off" 或者 0：关闭规则。
- "warn" 或者 1：打开规则，并且作为一个警告（不影响 exit code）。
- "error" 或者 2：打开规则，并且作为一个错误（exit code 将会是 1）。

一些配置规则，详情查看官网：https://zh-hans.eslint.org/docs/latest/rules/

```JSON
"no-console":"off" 禁用 console。
"no-unused-vars":2 禁止出现未使用过的变量。
"no-use-before-define":2 不允许在变量定义之前使用它们。
"linebreak-style":[2, "unix"] 强制使用一致的换行风格。
"quotes": ["error", "single"] 强制使用一致的单引号。
"semi":["error", "always"] 控制行尾部分号。
"curly":["error", "all"] 强制所有控制语句使用一致的括号风格。
"default-case": "error" switch 语句强制 default 分支，也可添加 // no default 注释取消此次警告。
"no-else-return":"error" 禁止 if 语句中有 return 之后有 else。
"no-implicit-coercion": "error" 禁止出现空函数.如果一个函数包含了一条注释，它将不会被认为有问题。
"no-invalid-this": "error" 禁止 this 关键字出现在类和类对象之外。
"no-loop-func":"error" 禁止在循环中出现 function 声明和表达式。
"no-multi-spaces":"error" 禁止使用多个空格。
"no-new-func":"error" 禁止对 空Function 对象使用 new 操作符。
"no-useless-return":"error" 禁止没有任何内容的return;
"global-require": "error" 要求 require() 出现在顶层模块作用域中。
"no-path-concat": "error" 禁止对 dirname 和 filename进行字符串连接
"no-sync": "error" 禁用同步方法。
"array-bracket-spacing": ["error", "never"] 指定数组的元素之间要以空格隔开(, 后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格。
"block-spacing": ["error", "always"] 禁止或强制在单行代码块中使用空格(禁用)。
"brace-style": ["error", "1tbs"]
"camelcase": "error" 强制驼峰法命名。
"comma-dangle": ["error", "always-multiline"] 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗,always-multiline：多行模式必须带逗号，单行模式不能带逗号号。
"comma-spacing": ["error", { "before": false, "after": true }] 控制逗号前后的空格。
"comma-style": ["error", "last"] 控制逗号在行尾出现还是在行首出现 (默认行尾)。
"key-spacing": ["error", { "beforeColon": false, "afterColon": true }] 该规则规定了在对象字面量语法中，key和value之间的空白，冒号前不要空格，冒号后面需要一个空格。
"lines-around-comment": ["error", { "beforeBlockComment": true }] 要求在注释周围有空行 ( 要求在块级注释之前有一空行)。
"newline-after-var": ["error", "always"] 要求或禁止 var 声明语句后有一行空行。
"newline-before-return": "error" 要求 return 语句之前有一空行。
"no-multi-assign": "error" 链接变量的赋值可能会导致意外的结果并难以阅读，不允许在单个语句中使用多个分配。
"max-params": [1, 3] function 定义中最多允许的参数数量。
"new-cap": ["error", { "newIsCap": true, "capIsNew": false}] 构造函数首字母大写。
"no-multiple-empty-lines": ["error", {"max": 2}] 空行不能够超过2行。
"no-shadow-restricted-names": "error" 禁止对一些关键字或者保留字进行赋值操作，比如NaN、Infinity、undefined、eval、arguments等。
"no-undef-init": "error" 禁止把undefined赋值给一个变量。
"keyword-spacing": "error" keyword 前后需要空格。
"space-before-blocks": ["error","always"] 强制在块之前使用一致的空格。
```

#### 忽略检测

在项目中，有的文件可能不需要被检测，比如 node_modules 文件夹，那么我们可以配置 eslintIgnore 来忽略检测：

- 在.eslintrc.\*配置文件中配置

```JavaScript
{
    eslintIgnore: ['node_modules/*']
}
```

- 在 package.json 中配置

```JSON
{
      "eslintIgnore": ["hello.js", "world.js"]
}
```

- 在.eslintignore 文件中配置

```Shell
# .eslintignore

# 全部忽略
**/*.js
```

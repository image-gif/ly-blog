# TypeScript 常用工具泛型函数总结

## Pick

> Pick 的作用是从 T 中取出一系列 K 的属性

```TypeScript
type Pick<T, K extends keyof T> = { [P in K]: T[P]; }; // 等价

// 实现这个泛型函数
type Person<T, K extends keyof T> = {
    [key in k]: T[key]
}

type Stu = {
    name: string,
    age: number,
    sex: number
}


// 等价
let one: Pick<Stu, 'name' | 'age'>;

let two: Person<Stu, 'name' | 'age'>;
```

## Keyof

> [TypeScript](https://so.csdn.net/so/search?q=TypeScript&spm=1001.2101.3001.7020)中的 keyof 操作符，是将一个类型映射为它所有成员名称的联合类型。

```TypeScript
interface Person {
  name: string;
  age: number;
  gender: string;
}
type P = keyof Person; // "name" | "age" | "gender"

// 我们可以看到，keyof将Person这个对象类型映射成了一个联合类型
// 因此我们可以更方便的操作这个联合类型
```

## Partial

> Partial 的作用是将传入的属性变成**可选项**，原理就是使用 keyof 拿到所有属性名，然后再使用 in[遍历]，T[P]拿到相应的值；

```TypeScript
type Partial<T> = {[K in keyof T]?: T[k]};

type Person = {
  name: string;
  age: number;
  sex: number;
};

// 这里使用Person类型的时候，所有属性都是必须填写的
let one: Person = {
  name: 'string',
  sex: 0,
  age: 1
};
// partial 将一个类型中的所有属性置位为必填属性
type Student = Partial<Person>;
// 此时里面的属性都是非必填属性
let two: Student = {};
// 实现
type Work<T> = {
  [K in keyof T]?: T[K];
};

let work: Work<Person> = {
  name: '123'
};
```

## Required

```JavaScript
// Required 顾名思义吧
type Person = {
  name: string;
  age?: number;
  sex: number;
};

// 此时的age属性是可选属性
let stu: Person = {
  name: 'string',
  sex: 1
};

type Work = Required<Person>;

let work: Work = {
  name: 'string',
  sex: 1,
  age: 3 // 此时的age属性为必填属性
};
// 实现
type Thing<T> = {
  [K in keyof T]-?: T[K]; // -? 顾名思义就是去掉选填的配置
};
```

## readOnly

```JavaScript
// readOnly 将传入的属性变成只读选项
type Person = {
  name: string;
  age: number;
  sex: number;
};

type Student = Readonly<Person>;

let stu: Student = {
  name: '123',
  age: 12,
  sex: 1
};

// stu.name = '123'; // 无法为“name”赋值，因为它是只读属性。

// 实现
type Work<T> = {
  readonly [K in keyof T]: T[K];
};
```

## Record

```TypeScript
// record 将K中所有属性的值转换成T类型
type Person = 'cat' | 'dog' | 'pig';

type Student = Record<Person, string>;

let stu: Student = {
  cat: 'string',
  dog: 'string',
  pig: 'string'
};
console.log(stu);
```

## Mutable

> 这个在使用的时候提示**找不到；**可能存在版本的问题

```TypeScript
// mutable 的作用是实现类型中所有只读属性修改为非只读属性
// 用法同readOnly
// 原理是就是： -readOnly
//

type Person = {
  name: string;
  readonly age: number;
};

type A<T> = {
  -readonly [k in keyof T]: T[k];
};

let person: A<Person> = {
  name: 'string',
  age: 12
};

person.age = 123;
```

## exclude

> Exclude 的作用是从 T 中找出 U 中没有的元素
> Constructs a type by excluding from UnionType all union members that are assignable to ExcludedMembers ---- 摘自官网
>
> 需要注意的是，这里需要的是联合类型

```TypeScript
type Exclude<T, U> = T extends U ? never : T;

type A = Exclude<'key1' | 'key2', 'key2'>
// 'key1'

type A = `Exclude<'key1' | 'key2', 'key2'>`

// 等价于

type A = `Exclude<'key1', 'key2'>` | `Exclude<'key2', 'key2'>`

// =>

type A = ('key1' extends 'key2' ? never : 'key1') | ('key'2 extends 'key2' ? never : 'key2')

// =>

// never是所有类型的子类型
type A = 'key1' | never = 'key1'
```

## Extract

> 高级类型`Extract`和上面的`Exclude`刚好相反，它是将第二个参数的联合项从第一个参数的联合项中`提取出来`，当然，第二个参数可以含有第一个参数没有的项。

```TypeScript
type Extract<T, U> = T extends U ? T : never
type A = Extract<'key1' | 'key2', 'key1'> // 'key1'
```

## Omit

> Omit 的作用是忽略对象的某些属性功能 它的作用主要是：以一个类型为基础支持剔除某些属性，然后返回一个新类型。

```TypeScript
// 等价
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// 案例
type Person = {
    name: string;
    age: string;
    location: string;
};

type PersonWithoutLocation = Omit<Person, 'location'>;

// PersonWithoutLocation equal to QuantumPerson
type QuantumPerson = {
    name: string;
    age: string;
};
```

## TypeScript 获取函数的参数类型、返回值类型

```TypeScript
const foo = (arg1: string, arg2: number): void => {};

type MyParameters<T> = T extends (...arg: infer U) => any ? U : never;

type FunctionParamsType = MyParameters<typeof foo>; // [arg1: string, arg2: number]

export { MyParameters };


// 测试
import type { Equal, Expect } from '@type-challenges/utils';
import type { MyParameters } from './Parameters';
const foo = (arg1: string, arg2: number): void => {};
const bar = (arg1: boolean, arg2: { a: 'A' }): void => {};
const baz = (): void => {};

type cases = [
  Expect<Equal<MyParameters<typeof foo>, [string, number]>>,
  Expect<Equal<MyParameters<typeof bar>, [boolean, { a: 'A' }]>>,
  Expect<Equal<MyParameters<typeof baz>, []>>
];

// 同理返回值类型
const fn = (v: boolean) => {
  if (v) return 1;
  else return 2;
};

// 代码实现
type MyReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never;

type a = MyReturnType<typeof fn>; // should be "1 | 2"
export {
  MyReturnType
}
```

# Angular
由于实习要求使用`Angular`，故此开始`Angular`的学习。
MVVM框架的组成：数据绑定、指令系统、组件式编程、路由和导航、状态保持、第三方组件库。
## 快速入门
先安装脚手架：
```shell
npm i -g @angular/cli
ng new myngapp
cd myngapp
npm start
```
## CLI构建器
处理器函数接收两个参数：一组`options`输入（JSON对象）和一个`context`（`BuilderContext`对象）。Angular提供了一些构建器，供CLI命令使用，如`ng build`和`ng test`等，这些内置CLI构建器的默认目标配置可以在工作区配置文件`angular.json`的`architect`部分找到。
### 构建器的项目结构
构建器位于一个`project`文件夹中，该文件夹的结构类似于Angular工作区，包括位于顶层的全局配置文件，以及位于工作代码所在源文件夹中的更具体的配置。

| 文件                       | 用途              |
| ------------------------ | --------------- |
| `src/my-builder.ts`      | 这个构建器定义的主要源码。   |
| `src/my-builder.spec.ts` | 测试的源码。          |
| `src/schema.json`        | 构建器输入选项的定义。     |
| `builder.json`           | 测试配置。           |
| `package.json`           | 依赖包。            |
| `tsconfig.json`          | Typescript配置文件。 |
## 组件
### 创建组件
在Shell中输入以下命令就可以实现：
```shell
./src/app
ng generate component <component-name>
或
ng g component <name>
```
自定义组件步骤：
1. 创建组件class
```js
@Component({
	selector: 'myComponent',
	template: '<h2>Hello</h2>'
})
export class MyComponent{}
```
2. 在某个模块中注册组件class
```js
// 先引入模块
import { MyComponent } from "./xxx/myComponent";
@NgModule({
	// 声明
	declarations: [
		AppComponent,
		MyComponent
	]
})
```
3. 在html模板中使用组件
### 组件的生命周期钩子函数
Angular中的组件的生命周期钩子函数的调用顺序:
- `constructor()`：组件对象被创建了
- `ngOnChanges()`：组件绑定的属性值发生改变了
- `ngOnInit()`：组件初始化完毕——等同于Vue中的`mounted`
- `ngDoCheck()`：组件检测到系统到对自己的影响（Angular捕捉不到）
- `ngAfterContentInit()`：组件的内容初始化完成
- `ngAfterContentChecked()`：组件的内容发生变化需要检查
- `ngAfterViewInit()`：组件的视图初始化完成
- `ngAfterViewChecked()`：组件的视图发生变化需要检查
- `ngOnDestory()`：组件即将被从DOM树上卸载，适合执行一些资源释放性语句

## 绑定
- HTML绑定： {{ NG 表达式 }} 【算术、比较、逻辑、三目、调用函数】
-  属性绑定
```html
<div titile="{{ name }}"></div>
或
<div [title]="name"></div>
```
-  指令绑定
```html
// for循环
<li *ngFor="let item of items; index as i">{{ item }}- {{ i }}</li>
// if指令
<div *ngIf="isPayingUser">
    this way true can see
</div>
// else 模板
<div *ngIf="age >= 18; else forChild">there adult</div>
<ng-template #forChild>there child</ng-template>
// 样式绑定 （绑定的值必须是一个对象）
<any [ngStyle]="obj"></any>  // 绑定CSS样式名
<any [ngClass]="obj"></any>  // 绑定CSS class名

```
-  事件绑定
```html
<button (click)="printName()">点击输出</button>
```
- 双向数据绑定
```html
// 需要导入FormsModule模块到app.module.ts下的import
<app-sizer [(size)]= "fontSizePx"></app-sizer>
// 监听双向绑定改变
<app-sizer [(size)]= "fontSizePx" (ngModuleChange)="function()"></app-sizer>
```
> Angular中有三种绑定指令：
> (1) **组件指令**：`ng g directive 指令名`生成指令，Angular中Component继承自Directive
> (2) **结构型指令**：会影响DOM树结构，必须使用 \* 开头，如\*ngFor、\*ngIf
> (3) **属性型指令**：不会影响DOM树结构，只是影响元素外观或行为，必须使用\[\]括起来

## 管道（Pipe）
过滤器或管道，用于在View中呈现数据时显示为另一种格式；过滤器本质是一个函数，接受原始数据转换为新的格式进行输出：function(oldVal) { ... return newVal; }
使用过滤器：{{ e.salary | 过滤器名 }}
自定义管道的方法：
- 创建管道class，实行转换功能
- 在模块中注册管道（declaration中声明）
- 在模板视图中使用管道 xxx | pipeName
管道的`transform`方法除了val以外还可以接受其他承诺书，调用管道时用冒号为这些参数赋值：{{ e.empSex | sex:'en' }}
## 依赖注入
第一步是添加`@Injectable`装饰器以声明此类可以被注入：
```js
@Injectable()
class HeroService {}
// 或
@Component({
  selector: 'hero-list',
  template: '...',
  providers: [HeroService]
})
class HeroListComponent {}
// 或
@NgModule({
  declarations: [HeroListComponent]
  providers: [HeroService]
})
class HeroListModule {}
```
第二步是注入依赖项：
```js
@Component({ … })
class HeroListComponent {
  constructor(private service: HeroService) {}
}
```
> 可以使用shell命令`ng g service <service-name>`来创建服务

在projectedIn里只能注册给`root`，但是在组件内注册服务可以添加属性、多次复用`provider:[service-name]`。
## 类与接口
```ts
// 使用接口 要求小汽车提供 start 和 stop 两个方法
interface Runnable {
	start();
	stop();	
}

// 通过类来实现接口
class Car implements Runnable{
	strat() {
		console.log("汽车启动");
	}

	stop() {
		console.log("汽车停止了");
	}
}

// 使用官方提供的管道接口
export class SexPipe implements PipeTransform {
	transfrom(val) {
		return val;
	}
}
```
## 服务
### HttpClient
HttpClient是Angular官方提供的用于发起异步XHR请求的对象，基于`观察者模式`处理响应，可以排队、并发、撤销。
使用步骤：
1. 在主模块`app.module.ts`的imports中导入`HttpClientModule`模块
2. 在组件中声明依赖于HttpClient服务对象，就会被自动注入进来`constructor(private http: HttpClient){}`
3. 调用HttpClient实例实现异步请求`this.http.get(url).subscribe((res) => {})`，返回值是一个`Observable`对象，使用`subscribe()`来订阅对象
```ts
import { HttpClientModule } from "@angular/common/http";

@NgModule({
	imports: [
		BrowserModule.
		HttpClientModule.
	]
})

// 组件内
export class xxx implements OnInit {
	// 列表
	private productList: object[] = [];

	// 在构造方法中实现依赖注入,HttpClient服务对象
	constructor(private http: HttpClient){}

	public loadMore(): void {
		this.http.get(url).subscribe((res) => {
			console.log(res.data);
		})
	}

	ngOnInit(){}
}
```
## 父子间组件传递
`Vue.js`与`Angular`中父子间消息传递的原理一样,`props down, events up`
- 方向一: 父 -> 子
- 方向二: 子 -> 父
### 父传子
```html
<!-- 父组件下 -->
<app-myc02-child1-modify [child2Name]="userName"></app-myc02-child1-modify>
<!-- 子组件myc02 -->
// 输入性属性: 父组件可以利用这种属性传值进来
@Input()
private child2Name: string = null
```
### 子传父
子组件通过出发特定的事件(其中携带数据),把数据传递给父组件(父组件提供事件处理方法)
```app.module.ts
import { FormsModule } from "angular/forms";

@NgModule({
	imports: [
		...,
		FormsModule
	]
})

// 子组件
<app-myc02-child1-modify (cryEvent)="doCry($event)"></app-myc02-child1-modify>

// 事件发射器, 子组件给父组件
@Output()
private cryEvent = new EventEmitter();
doModify() {
	console.log(this.userInput);
	// 携带发射数据
	this.cryEvent.emit(this.userInput);	
}

// 父组件监听子组件发射事件,父组件提供doCry
doCry(event) {
	// 处理子组件的doCry event
	console.log(event);  // 自定义事件发射来的数据
}
```
> 父子组件传递数据的简便方法: 父组件直接使用子组件的引用

```html
<div #c0></div>
<div #c1></div>
<div #c2></div>
```
使用`@ViewChild`视图子组件:
```ts
@ViewChild('c0', { static: true })
private child0;
@ViewChild('c1', { static: true })
private child1;
@ViewChild('c2', { static: true })
private child2;
// 如果有使用ngif/ngfor,请将静态选项改为false

print() {
	console.log(this.child1);
	console.log(this.child2);
	console.log(this.child3);
}
```
## 路由与导航
### 路由的创建
步骤:
1. 定义路由词典 -- [{URL-组件},{URL-组件}]
2. 注册路由词典
3. 创建路由组件挂载点
4. 访问测试
在`app.module.ts`中声明路由词典
```ts
const routes: Route = [
	// 路由重定向
	{ path: "", redirectTo: "index", patchMatch: "full" },
	// 路由匹配 (full/prefix)
	{ ..., pathMatch: "full"}
	{ path: "index", component: xxxComponent },
	{ path: "list", component: xxx2Component },
	// ** 地址匹配任意url地址 (从上往下匹配)
	{ path: "**", component: NotFoundComponent}
];

...,
import: [
	BrowswerModule,
	// forRoot 用于根模块, forChild用于根模块
	RouterModule.forRoot(routes)  // 导入路由模块,并这侧路由词典
]
```
在`html`里面使用出口:
```html
<router-outlet></router-outlet>
```
### 路由跳转/导航/传参
实现方式:
- 使用模板方法
```html
<!-- 元素没有限制,必须加入斜杠/,最新版本可以不用加斜杠 -->
<a routerLink="/ucenter">进入用户中心</a>
<div routerLink="/ucenter">进入用户中心</div>
```
- 使用脚本跳转方法
```ts
// route当前路由, router表示路由模块
this.$route, this.$router
<button (click)="jump()"></button>

constructor(private router: Router) {}
jump() {
	// 跳转到指定页
	this.router.navigateByUrl('/xxx')
}
```
> hash法: 只修改url中的hash部分 (Angular中没有)
> history法: 只修改window.history对象,从而支持浏览器自带的后退按钮
#### 路由参数
在路由词典中定义路由地址时,其中包含可变的参数:
```ts
{ path: 'xxx/:lid', component: ... }
```
在路由跳转时可以为路由参数提供具体的参数值:
```html
<a routerLink="/product/detail/1">
```
读取当前路由地址中的路由参数:
```ts
constructor(private route: ActivedRoute){}

ngOnInit() {
	this.route.params.subscribe((data) => {
		this.productid = data.lid
	})
}
```
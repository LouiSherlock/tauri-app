# Tauri + React + Typescript

## 开发

```bash
pnpm tauri dev        # 桌面
pnpm tauri android dev  # Android（模拟器/真机）
pnpm dev:stop         # 端口被占、进程残留时一键清掉
```

## 清除缓存

在项目的 src-tauri 目录执行：

`cargo clean`

## 构建时候可能出现的问题

## 构建注意事项

### 修改 `identifier` 后 Android 启动失败

`src-tauri/gen/android` 里的包名不会自动跟着 `tauri.conf.json` 变化。若看到
`Project directory .../java/app/lingora does not exist`，二选一：

- 手动同步：`MainActivity.kt` 的 `package`、`app/build.gradle.kts` 的
  `namespace` / `applicationId`，以及 `java/<包路径>/` 目录；
- 或者删除 `src-tauri/gen/android`，运行 `pnpm tauri android init` 重新生成。

### 内存引用冲突

降低同时构建线程

```bash
$env:CARGO_BUILD_JOBS=1
pnpm tauri build
```


也可以在项目的 .cargo/config.toml 中永久设置：

```toml
[build]
jobs = 2
```


### 批量生成图标

```bash
pnpm tauri icon ./public/logo.png
```


### 提示词技巧

1. 审查下你现在的代码实现，是否有遗漏的，不要你以为的来实现代码，不要模糊，要以事实文档为准。
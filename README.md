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

### 内存引用冲突

降低同时构建线程

$env:CARGO_BUILD_JOBS=1
pnpm tauri build


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
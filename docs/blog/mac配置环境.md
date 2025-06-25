---
data: 2025-6-13
tage: [杂谈]
---

# 为MacOS配置开发环境

!!! note "第一步"
    安装`clash-x`, 哎，国内的网络环境还是不太行，若可能还是需要去国外查查资料啥的.

安装`brwe house`
```shell

```

## 配置终端代理
对于macos其默认终端为`zsh`，按照如下操作即可
```zsh
vi ~/.zshrc # 通过vim往zsh的配置文件中写入东西

alias proxy='export all_proxy=socks5://127.0.0.1:????'  # ????为代理端口号，此为开启代理的指令
alias unproxy='unset all_proxy'
# 此为关闭代理的指令

source ~/.zshrc # 启动配置
proxy # 启动代理
# unproxy 为关闭代理
```

!!! note "为git配置代理"
    执行如下命令启动git的代理
    ```zsh
    git config --global http.proxy http://127.0.0.1:????
    git config --global https.proxy https://127.0.0.1:???? #其中????均为端口号
    ```

    ```zsh
    git config --global --unset http.proxy
    git config --global --unset https.proxy #去除配置
    ```

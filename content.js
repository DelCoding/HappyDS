// == 完整解决方案 ==
(function() {
    // 唯一全局标志，防止命名冲突
    const EXTENSION_FLAG = '__HAPPY_DS_EXTENSION_ACTIVE__';
    
    // 检查执行状态（IIFE内允许使用return）
    if (window[EXTENSION_FLAG]) {
        console.warn('🚫 扩展已初始化，跳过执行');
        return;
    }
    window[EXTENSION_FLAG] = true;
    console.group('🔧 扩展初始化开始');

    // 页面加载状态检查
    function whenReady(fn) {
        console.log('⏳ 当前文档状态:', document.readyState);

        const readyHandler = () => {
            console.log('✅ 页面加载完成');
            document.removeEventListener('DOMContentLoaded', readyHandler);
            setTimeout(fn, 0);
        };

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            console.log('⚡ 立即执行（页面已准备就绪）');
            setTimeout(fn, 0);
        } else {
            console.log('👂 等待DOMContentLoaded事件');
            document.addEventListener('DOMContentLoaded', readyHandler);
        }
    }

    whenReady(function mainInit() {
        console.group('📦 主逻辑启动');

        // 防抖控制变量
        let debounceTimer;
        // 再生状态锁
        let isRegenerating = false;
        console.log('🕵️ 初始化MutationObserver');

        // 使用WeakSet记录已处理的节点（自动内存管理）
        // const processedNodes = new WeakSet();
        
        const observer = new MutationObserver(mutations => {
            // console.log(`📦 DOM变更检测 (${mutations.length}处改动)`);

            // 防抖检查
            if (debounceTimer) {
                // console.log('⏳ 防抖进行中，跳过处理');
                return;
            }
            if (isRegenerating) {
                // console.log('🔄 再生操作进行中，跳过处理');
                return;
            }

            // 设置防抖延迟
            // console.log('⏲️ 启动150ms防抖计时');
            debounceTimer = setTimeout(() => {
                // console.log('🎯 执行防抖后处理');
                debounceTimer = null;
                processDOM();
            }, 150);
        });

        // DOM处理逻辑
        function processDOM() {
            // console.group('🔍 处理DOM');
            try {
                // 查找结果容器
                // console.log('🔎 查找结果容器');
                const results = document.querySelectorAll(
                    '#root > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(1) > div'
                );
                // console.log(`📊 找到${results.length}个结果容器`);

                if (results.length === 0) {
                    // console.warn('❌ 未找到结果容器');
                    return;
                }

                // 获取最后一个对话块
                const lastFlex = results[results.length - 1];
                // console.log('🖥️ 最后一个flex元素:', lastFlex);
                
                // 跳过已处理的节点
                // if (processedNodes.has(lastFlex)) {
                //     console.log('⏭️ 跳过已处理的节点');
                //     return;
                // }
                // processedNodes.add(lastFlex);
                // console.log('✅ 标记为新处理节点');

                // 检查Markdown内容
                const markdownAreas = lastFlex.querySelectorAll('div.ds-markdown');
                // console.log(`📝 找到${markdownAreas.length}处Markdown内容`);

                if (markdownAreas.length === 0) {
                    // console.warn('❌ 未找到Markdown内容');
                    return;
                }

                // 分析最后一条消息
                const lastMarkdown = markdownAreas[markdownAreas.length - 1];
                const textContent = lastMarkdown.textContent;
                // console.log('📄 内容预览:', textContent.slice(0, 50) + '...');

                // 服务器繁忙检测
                if (textContent.startsWith("服务器繁忙")) {
                    console.warn('⚠️ 检测到服务器繁忙警告');
                    
                    // 查找操作按钮容器
                    const actionBar = lastFlex.querySelector('div.ds-flex');
                    // console.log(actionBar ? '🔧 找到操作栏' : '❌ 未找到操作栏');
                    if (!actionBar) return;

                    // 获取所有按钮
                    const buttons = actionBar.querySelectorAll('div.ds-icon-button');
                    // console.log(`🛎️ 找到${buttons.length}个按钮`);
                    
                    // 点击再生按钮
                    if (buttons.length > 1) {
                        console.log('🖱️ 点击重新生成');
                        isRegenerating = true;
                        buttons[1].click();
                        
                        // 重置状态锁
                        setTimeout(() => {
                            console.log('🔄 重置再生状态');
                            isRegenerating = false;
                        }, 1000);
                    }
                }
            } finally {
                console.groupEnd();
            }
        }

        // 初始化观察目标
        const rootNode = document.querySelector('#root');
        console.log(rootNode ? '🎯 找到根节点' : '❌ 未找到根节点');
        if (rootNode) {
            observer.observe(rootNode, {
                childList: true,
                subtree: true
            });
        }

        // 清理逻辑
        window.addEventListener('unload', () => {
            console.log('🧹 执行清理');
            observer.disconnect();
            clearTimeout(debounceTimer);
            delete window[EXTENSION_FLAG];
            console.groupEnd();
        });

        console.groupEnd();
    });

    console.groupEnd();
})();
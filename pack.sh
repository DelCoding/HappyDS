#!/bin/bash

set -euo pipefail

# 配置参数
current_date=$(date +%Y%m%d)
output_dir="./dist"           # 输出目录
dist_name="happy-ds-dist-${current_date}.zip"
source_files=("./icons/" "content.js" "manifest.json")

# 创建输出目录（如果不存在）
mkdir -p "${output_dir}"      # -p 确保自动创建多级目录

echo "📦 开始打包到 ${output_dir} 目录..."

# 执行压缩（自动定位到 dist 目录）
zip -r "${output_dir}/${dist_name}" "${source_files[@]}"

# 显示生成文件的完整路径
real_path=$(realpath "${output_dir}/${dist_name}")
echo "✅ 打包完成！文件已保存至："
echo "   ${real_path}"

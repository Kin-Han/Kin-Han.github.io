---
title: 图库
date: 2026-09-15 12:00:00
type: "gallery"
comments: false
---

<!-- ===================== 图库维护说明（给未来的自己） =====================
  主页每张卡片 = 一个模型相册。

  【添加新模型相册】三步：
    1. 图片转 WebP：node tools\convert-images.mjs _inbox source\img\gallery\<模型名>
    2. 新建相册页 source\gallery\<模型名>\index.md
       （直接复制 portrait\index.md 的结构，把图片行换成你的图）
    3. 在下方卡片区加一行：
       {% galleryGroup '系列标题' '副标题说明' '/gallery/<模型名>/' 'img/gallery/<模型名>/封面图.webp' %}

  【删除相册】删掉对应那行卡片 + 相册文件夹即可。
  【加图到现有相册】打开相册页，在 {% gallery %} 块末尾追加一行：
       ![模型名](/img/gallery/<模型名>/新图.webp)
===================================================================== -->

<div class="gallery-group-main">

{% galleryGroup 'ZImageTurbo 系列' '日系人像写真 · 本地 ZIT 模型生成' '/gallery/portrait/' 'img/gallery/ComfyUI_00243_.webp' %}

<!-- Krea 2 相册骨架已建好（source/gallery/krea2/），
     放入第一张图后，把封面图地址填好并取消下面这行注释即可上卡片：
{% galleryGroup 'Krea 2 系列' 'Krea 2 模型实验' '/gallery/krea2/' 'img/gallery/krea2/封面图.webp' %}
-->

</div>

---
layout: _layouts/product_card.njk
id: manontasB1
name:
    fr: 茶杯 - CháBēi
    en: Tea Cup - CháBēi
mini_descr:
    fr: petit bol à thé réalisé par Manon Clouzeau
    en: small tea bowl made by Manon Clouzeau
tags: ['produit', 'manon-clouzeau']
description: 
    fr: >
        茶杯 - CháBēi en céramique, 1250°C. Pièce unique.
    en: >
        CháBēi - Tea Cup made of ceramic, fired at 1250°C. Unique piece.
photos:
    - manon_tasse_B1-a.jpg
    - manon_tasse_B1-b.jpg
    - manon_tasse_B1-c.jpg
price: 15.00
stock: 1
weight: 35
shipping_type: colis_base
shipping_point: 2
options:
    fr:
        dimensions: 6cm x 3,5cm
        capacité: 28ml
    en:
        dimensions: 6cm x 3.5cm
        capacity: 28ml
eleventyComputed:
    title: '{{ tags }} - {{ name[page.lang] }}'
---
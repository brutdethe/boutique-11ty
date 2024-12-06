---
layout: _layouts/product_card.njk
id: Don100
name: 100 € donation
tags: ['product', 'dons']

description: >
    Donate 100 € and receive a tasting kit and the festival poster.
photos:
    - ticket-gongfucha.jpg
price: 100.00
stock: 30
shipping_type: sans_envoi

eleventyComputed:
    title: '{{ tags }} - {{ name }}'
---

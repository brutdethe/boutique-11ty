---
layout: default.njk
title: >
    Product Card - 茶杯 - CháBēi (little Tea Cup) - 
    Manon Clouzeau - A9
description: >
    茶杯 - CháBēi in ceramic, 1250°C.
photos:
    - manon_tasse_A29-a.jpg
    - manon_tasse_A29-b.jpg
options:
    dimension: 2 inch x 3 inch
    capacity: 20 Oz
    weight: 135 g
    stock: rest 1 piece
---

![{{ photos[0] }}]({{ settings.dirs.img_products | url }}{{ photos[0] }})  
[{{ photos[1] }}]({{ settings.dirs.img_products | url }}{{ photos[1] }})  
{{ description }}  
---
{% for key, value in options %}
{{ key }} : {{ value }}  
{% endfor %}

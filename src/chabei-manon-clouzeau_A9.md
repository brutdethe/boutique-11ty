---
layout: default.njk
title: >
    Fiche produit - 茶杯 - CháBēi (petit bol à thé) - 
    Manon Clouzeau - A9
description: >
    茶杯 - CháBēi en céramique, 1250°C. Pièce unique.
photos:
    - manon_tasse_A29-a.jpg
    - manon_tasse_A29-b.jpg
options:
    dimension: 7 cm x 3 cm
    capacité: 40 ml
    poids: 135 g
    stock: il reste 1 article
---

![{{ photos[0] }}]({{ settings.dirs.img_products | url }}{{ photos[0] }})  
[{{ photos[1] }}]({{ settings.dirs.img_products | url }}{{ photos[1] }})  
{{ description }}  
---
{% for key, value in options %}
{{ key }} : {{ value }}  
{% endfor %}




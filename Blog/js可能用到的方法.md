##  保留小数位数 
### function toDecimal (num, size) { return (String(num) + Array((size || 2) + 1).join('0')).replace(/\./g, '').replace(new RegExp('(' + parseInt(num) + ')'), '$1.').match(new RegExp('\\d+\\.\\d{' + size + '}'))[0]}

![看结果](https://github.com/jinggk/Blog/blob/master/Blog/img/toDecomal.png)

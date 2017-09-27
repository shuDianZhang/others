var webpack = require('webpack');

module.exports = {
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: __dirname
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },
    devServer:{
        contentBase: __dirname,
		colors: true,
		historyApiFallback: true, //当设置为true时，访问所有服务器上不存在的文件，都会被重定向到/，也就是index.html文件
        inline: true,             //设为true时可以在文件发生变化时，更新页面
        port: 3000                //服务器使用的端口，默认情况下为8080 
    }
};
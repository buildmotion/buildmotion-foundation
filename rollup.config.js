export default {
	entry: 'dist/index.js',
	dest: 'dist/bundles/buildmotion-foundation.umd.js',
	sourceMap: false,
	format: 'umd',
	moduleName: 'buildmotion-foundation',
	globals: {
		'@angular/core': 'ng.core',
		'@angular/http': 'ng.http',
		'@angular/router': 'ng.router',
		'rxjs/Observable': 'Rx',
		'rxjs/add/operator/cache': 'Rx.Observable.prototype'
	}
}
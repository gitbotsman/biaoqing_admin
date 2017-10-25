/*! qiniu-js v1.0.18 | Copyright 2015 by Qiniu 注意打印日志的方法log()被禁，如需使用可解禁  请求七牛的服务器主机更改为本地获取 在260行可更改*/
/*****
bucket 空间名
*****/
!
function(global) {
	function createCookie(a, b, c) {
		var d = new Date;
		d.setTime(d.getTime() + 24 * c * 60 * 60 * 1000);
		var e = "; expires=" + d.toGMTString();
		document.cookie = a + "=" + b + e + "; path=/"
	}
	function readCookie(a) {
		var b = a + "=";
		var c = document.cookie.split(";");
		for (var d = 0,
		e = c.length; e > d; d++) {
			var f = c[d];
			while (" " === f.charAt(0)) {
				f = f.substring(1, f.length)
			}
			if (0 === f.indexOf(b)) {
				return f.substring(b.length, f.length)
			}
		}
		return null
	}
	if (! ( !! window.ActiveXObject || "ActiveXObject" in window)) {
		window.localStorage || (window.localStorage = {
			setItem: function(a, b) {
				createCookie(a, b, 30)
			},
			getItem: function(a) {
				return readCookie(a)
			},
			removeItem: function(a) {
				createCookie(a, "", -1)
			}
		})
	}
	function QiniuJsSDK() {
		var that = this;
		this.detectIEVersion = function() {
			var a = 4,
			b = document.createElement("div"),
			c = b.getElementsByTagName("i");
			while (b.innerHTML = "<!--[if gt IE " + a + "]><i></i><![endif]-->", c[0]) {
				a++
			}
			return a > 4 ? a: !1
		};
		var logger = {
			MUTE: 0,
			FATA: 1,
			ERROR: 2,
			WARN: 3,
			INFO: 4,
			DEBUG: 5,
			TRACE: 6,
			level: 0
		};
		function log(a, b) {
			var c = "[qiniu-js-sdk][" + a + "]";
			var d = c;
			for (var e = 0; e < b.length; e++) {
				d += "string" == typeof b[e] ? " " + b[e] : " " + that.stringifyJSON(b[e])
			}
			// console.log(d)
			document.getElementById("qiniu-js-sdk-log") && (document.getElementById("qiniu-js-sdk-log").innerHTML += "<p>" + d + "</p>")
		}
		function makeLogFunc(a) {
			var b = a.toLowerCase();
			logger[b] = function() {
				if (window.console && window.console.log && logger.level >= logger[a]) {
					var c = Array.prototype.slice.call(arguments);
					log(b, c)
				}
			}
		}
		for (var property in logger) {
			logger.hasOwnProperty(property) && "number" == typeof logger[property] && !logger.hasOwnProperty(property.toLowerCase()) && makeLogFunc(property)
		}
		var qiniuUploadUrl;
		qiniuUploadUrl = "https:" === window.location.protocol ? "https://v0.api.upyun.com/": "https://v0.api.upyun.com/";
		var qiniuUploadUrls = ["https://v0.api.upyun.com/", "https://v0.api.upyun.com/"];
		var qiniuUpHosts = {
			http: ["https://v0.api.upyun.com/"],
			https: ["https://v0.api.upyun.com/"]
		};
		var changeUrlTimes = 0;
		this.resetUploadUrl = function() {
			var a = "https:" === window.location.protocol ? qiniuUpHosts.https: qiniuUpHosts.http;
			var b = changeUrlTimes % a.length;
			qiniuUploadUrl = a[b],
			changeUrlTimes++,
			logger.debug("resetUploadUrl: " + qiniuUploadUrl)
			// console.log(qiniuUploadUrl)
		},
		this.isImage = function(a) {
			return a = a.split(/[?#]/)[0],
			/\.(png|jpg|jpeg|gif|bmp)$/i.test(a)
		},
		this.getFileExtension = function(a) {
			var b = a.split(".");
			var c;
			return c = 1 === b.length || "" === b[0] && 2 === b.length ? "": b.pop().toLowerCase()
		},
		this.utf8_encode = function(a) {
			if (null === a || "undefined" == typeof a){
				return ""
			}
			var b = a + "";
			var c = "",
			d, e, f = 0;
			d = e = 0,
			f = b.length;
			for (var g = 0; f > g; g++) {
				var h = b.charCodeAt(g);
				var i = null;
				if (128 > h) {
					e++
				} else {
					if (h > 127 && 2048 > h) {
						i = String.fromCharCode(h >> 6 | 192, 63 & h | 128)
					} else {
						if (63488 & h ^ !0) {
							i = String.fromCharCode(h >> 12 | 224, h >> 6 & 63 | 128, 63 & h | 128)
						} else {
							if (64512 & h ^ !0) {
								throw new RangeError("Unmatched trail surrogate at " + g)
							}
							var j = b.charCodeAt(++g);
							if (64512 & j ^ !0) {
								throw new RangeError("Unmatched lead surrogate at " + (g - 1))
							}
							h = ((1023 & h) << 10) + (1023 & j) + 65536,
							i = String.fromCharCode(h >> 18 | 240, h >> 12 & 63 | 128, h >> 6 & 63 | 128, 63 & h | 128)
						}
					}
				}
				null !== i && (e > d && (c += b.slice(d, e)), c += i, d = e = g + 1)
			}
			return e > d && (c += b.slice(d, f)),
			c
		},
		this.base64_decode = function(a) {
			var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			var c, d, e, f, g, h, i, j, k = 0,
			l = 0,
			m = "",
			n = [];
			if (!a) {
				return a
			}
			a += "";
			do {
				f = b.indexOf(a.charAt(k++)), g = b.indexOf(a.charAt(k++)), h = b.indexOf(a.charAt(k++)), i = b.indexOf(a.charAt(k++)), j = f << 18 | g << 12 | h << 6 | i, c = j >> 16 & 255, d = j >> 8 & 255, e = 255 & j, 64 === h ? n[l++] = String.fromCharCode(c) : 64 === i ? n[l++] = String.fromCharCode(c, d) : n[l++] = String.fromCharCode(c, d, e)
			} while ( k < a . length );
			return m = n.join("")
		},
		this.base64_encode = function(a) {
			var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			var c, d, e, f, g, h, i, j, k = 0,
			l = 0,
			m = "",
			n = [];
			if (!a) {
				return a
			}
			a = this.utf8_encode(a + "");
			do {
				c = a.charCodeAt(k++), d = a.charCodeAt(k++), e = a.charCodeAt(k++), j = c << 16 | d << 8 | e, f = j >> 18 & 63, g = j >> 12 & 63, h = j >> 6 & 63, i = 63 & j, n[l++] = b.charAt(f) + b.charAt(g) + b.charAt(h) + b.charAt(i)
			} while ( k < a . length );
			switch (m = n.join(""), a.length % 3) {
			case 1:
				m = m.slice(0, -2) + "==";
				break;
			case 2:
				m = m.slice(0, -1) + "="
			}
			return m
		},
		this.URLSafeBase64Encode = function(a) {
			return a = this.base64_encode(a),
			a.replace(/\//g, "_").replace(/\+/g, "-")
		},
		this.URLSafeBase64Decode = function(a) {
			return a = a.replace(/_/g, "/").replace(/-/g, "+"),
			this.base64_decode(a)
		},
		this.createAjax = function(a) {
			var b = {};
			return b = window.XMLHttpRequest ? new XMLHttpRequest: new ActiveXObject("Microsoft.XMLHTTP")
		},
		this.parseJSON = function(data) {
			if (window.JSON && window.JSON.parse) {
				return window.JSON.parse(data)
			}
			var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
			var text = String(data);
			return rx_dangerous.lastIndex = 0,
			rx_dangerous.test(text) && (text = text.replace(rx_dangerous,
			function(a) {
				return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice( - 4)
			})),
			eval("(" + text + ")")
		},
		this.stringifyJSON = function(a) {
			if (window.JSON && window.JSON.stringify) {
				return window.JSON.stringify(a)
			}
			switch (typeof a) {
			case "string":
				return '"' + a.replace(/(["\\])/g, "\\$1") + '"';
			case "array":
				return "[" + a.map(that.stringifyJSON).join(",") + "]";
			case "object":
				if (a instanceof Array) {
					var b = [];
					var c = a.length;
					for (var d = 0; c > d; d++) {
						b.push(that.stringifyJSON(a[d]))
					}
					return "[" + b.join(",") + "]"
				}
				if (null === a) {
					return "null"
				}
				var e = [];
				for (var f in a) {
					a.hasOwnProperty(f) && e.push(that.stringifyJSON(f) + ":" + that.stringifyJSON(a[f]))
				}
				return "{" + e.join(",") + "}";
			case "number":
				return a;
			case ! 1 : return a;
			case "boolean":
				return a
			}
		},
		this.trim = function(a) {
			return null === a ? "": a.replace(/^\s+|\s+$/g, "")
		},
		// 初始化
		this.uploader = function(a) {
			var bucket = 'biaoqingimg';//upyun空间名 
			var b = function() {
				var b = that.detectIEVersion();
				var c, d, e;
				// var f = "Safari" === mOxie.Env.browser && mOxie.Env.version <= 5 && "Windows" === mOxie.Env.os && "7" === mOxie.Env.osVersion || "Safari" === mOxie.Env.browser && "iOS" === mOxie.Env.os && "7" === mOxie.Env.osVersion;
				b && 9 > b && a.chunk_size && a.runtimes.indexOf("flash") >= 0 ? a.chunk_size = 0 : f ? a.chunk_size = 0 : (c = 20, d = 4 << c, e = plupload.parseSize(a.chunk_size), e > d && (a.chunk_size = d))
			};
			var c = function(a) {
				var b = [];
				for (var c = 0; c < a.length; c++) {
					var d = a[c];
					0 === d.indexOf("-H") ? b.push(d.split(" ")[2]) : b.push(d)
				}
				return b
			};
			var d = function(a) {
				var b = a.split(":");
				var c = b[0];
				var d = that.parseJSON(that.URLSafeBase64Decode(b[2]));
				return d.ak = c,
				d.scope.indexOf(":") >= 0 ? (d.bucket = d.scope.split(":")[0], d.key = d.scope.split(":")[1]) : d.bucket = d.scope,
				d
			};
			var e = function(b) {
				var a = {
					"ttl": 86400,
					"http": {
						"io": ["http://iovip.qbox.me"],
						"up": ["https://v0.api.upyun.com/"]
					},
					"https": {
						"io": ["https://iovip.qbox.me"],
						"up": ["https://v0.api.upyun.com/"]
					}
				};
				qiniuUpHosts.http = c(a.http.up),
				qiniuUpHosts.https = c(a.https.up),
				logger.debug("get new uphosts: ", qiniuUpHosts),
				that.resetUploadUrl()
			};
			var f = function(b) {
				return ! that.token || a.uptoken_url && that.tokenInfo.isExpired() ? g(b) : that.token
			};
			// 获取token
			var g = function(b) {
				if (a.uptoken) {
					that.token = a.uptoken
				} else {
					if (a.uptoken_url) {
						logger.debug("get uptoken from: ", that.uptoken_url);
						var c = that.createAjax();
						if (c.open("GET", that.uptoken_url, !1), c.setRequestHeader("If-Modified-Since", "0"), c.send(), 200 === c.status) {
							var d = that.parseJSON(c.responseText);
							that.token = d.uptoken;
							var f = that.token.split(":");
							var g = that.parseJSON(that.URLSafeBase64Decode(f[2]));
							that.tokenMap || (that.tokenMap = {});
							var h = function(a) {
								return Math.ceil(a.getTime() / 1000)
							};
							var i = h(new Date(c.getResponseHeader("date")));
							var j = h(new Date);

							that.tokenInfo = {
								serverDelay: j - i,
								deadline: g.deadline,
								isExpired: function() {
									var a = this.deadline - h(new Date) + this.serverDelay;
									return 600 > a
								}
							},
							logger.debug("get new uptoken: ", that.token),
							logger.debug("get token info: ", that.tokenInfo)
						} else {
							logger.error("get uptoken error: ", c.responseText)
						}
					} else {
						a.uptoken_func ? (logger.debug("get uptoken from uptoken_func"), that.token = a.uptoken_func(b), logger.debug("get new uptoken: ", that.token)) : logger.error("one of [uptoken, uptoken_url, uptoken_func] settings in options is required!")
					}
				}
				return that.token && e(that.token),
				that.token
			};
			// 获取key
			var h = function(b, c, d) {
				var e = "",
				f = !1;
				if (!a.save_key) {
					if (f = b.getOption && b.getOption("unique_names"), f = f || b.settings && b.settings.unique_names) {
						var g = that.getFileExtension(c.name);
						e = g ? c.id + "." + g: c.id
					} else {
						e = "function" == typeof d ? d(b, c) : c.name
					}
				}
				return e
			};
			if (a.log_level && (logger.level = a.log_level), !a.domain) {
				throw "domain setting in options is required!"
			}
			if (!a.browse_button) {
				throw "browse_button setting in options is required!"
			}
			logger.debug("init uploader start"),
			// logger.debug("environment: ", mOxie.Env),
			logger.debug("userAgent: ", navigator.userAgent);
			var i = {};
			var j = a.init && a.init.Error;
			var k = a.init && a.init.FileUploaded;
			a.init.Error = function() {},
			a.init.FileUploaded = function() {},
			that.uptoken_url = a.uptoken_url,
			that.token = "",
			that.key_handler = "function" == typeof a.init.Key ? a.init.Key: "",
			this.domain = a.domain;
			var l = "";
			var m = {
				isResumeUpload: !1,
				resumeFilesize: 0,
				startTime: "",
				currentTime: ""
			};
			b(),
			logger.debug("invoke reset_chunk_size()"),
			logger.debug("op.chunk_size: ", a.chunk_size);

			var n = {
				url: qiniuUploadUrl,
				multipart_params: {
					token: ""
				}
			};
			var o = that.detectIEVersion();
			o && 9 >= o && (n.multipart_params.accept = "text/plain; charset=utf-8", logger.debug("add accept text/plain in multipart params")),
			plupload.extend(i, a, n),
			logger.debug("option: ", i);
			var p = new plupload.Uploader(i);
			logger.debug("new plupload.Uploader(option)"),
			p.bind("Init",
			function(b, c) {
				logger.debug("Init event activated"),
				a.get_new_uptoken || g(null)
			}),
			logger.debug("bind Init event"),
			p.bind("FilesAdded",
			function(a, b) {
				logger.debug("FilesAdded event activated");
				var c = a.getOption && a.getOption("auto_start");
				c = c || a.settings && a.settings.auto_start,
				logger.debug("auto_start: ", c),
				logger.debug("files: ", b);
				var d = function() {
					// return "ios" === mOxie.Env.OS.toLowerCase() ? !0 : !1
				};
				if (d()) {
					for (var e = 0; e < b.length; e++) {
						var f = b[e];
						var g = that.getFileExtension(f.name);
						f.name = f.id + "." + g
					}
				}
				c && setTimeout(function() {
					a.start(),
					logger.debug("invoke up.start()")
				},
				0),
				a.refresh()
			}),
			logger.debug("bind FilesAdded event"),
			p.bind("BeforeUpload",
			function(b, c) {
				logger.debug("BeforeUpload event activated"),
				c.speed = c.speed || 0,
				l = "",
				a.get_new_uptoken && g(c);
				var d = function(b, c, d) {
					m.startTime = (new Date).getTime();
					var f;
					f = a.save_key ? {
						token: that.token
					}: {
						key: h(b, c, d),
						token: that.token
					};
					var g = that.detectIEVersion();
					g && 9 >= g && (f.accept = "text/plain; charset=utf-8", logger.debug("add accept text/plain in multipart params")),
					logger.debug("directUpload multipart_params_obj: ", f);
					var i = a.x_vars;
					if (void 0 !== i && "object" == typeof i) {
						for (var j in i) {
							i.hasOwnProperty(j) && ("function" == typeof i[j] ? f["x:" + j] = i[j](b, c) : "object" != typeof i[j] && (f["x:" + j] = i[j]))
						}
					}
					if(f.key.indexOf('/')!=0){
						f.key='/'+f.key;
					}
					// var bucket = 'imgbiaoqing';//upyun空间名
				    // var form_api_secret = 'OaTXjSVodabIZRxk2tW+Rjjn41c=';
				    
				    var form_api_secret ='7ksIaYvblj0Lxc7KILu6lvYfnVg=';
				    var options = {
				      'bucket':bucket,
				      'expiration':Math.floor(new Date().getTime() / 1000) + 86400,
				      'save-key':f.key
				    }
				    options=JSON.stringify(options)
				    var policy = that.base64_encode(options);//policy 生成
				    var signature = hex_md5(policy+'&'+form_api_secret);// sigenature生成

					f.policy=policy;
					f.signature=signature;
					b.setOption({
						url: qiniuUploadUrl+bucket,
						multipart: !0,
						chunk_size: e() ? a.max_file_size: void 0,
						multipart_params: f
					})
				};
				var e = function() {
					var a = navigator.userAgent.toLowerCase();
					// return (a.match(/MicroMessenger/i) || "QQBrowser" === mOxie.Env.browser || a.match(/V1_AND_SQ/i)) && "android" === mOxie.Env.OS.toLowerCase() ? !0 : !1
				};

				var i = b.getOption && b.getOption("chunk_size");

				if (i = i || b.settings && b.settings.chunk_size, logger.debug("uploader.runtime: ", p.runtime), logger.debug("chunk_size: ", i), "html5" !== p.runtime && "flash" !== p.runtime || !i) {
					logger.debug("directUpload because uploader.runtime !== 'html5' || uploader.runtime !== 'flash' || !chunk_size"),
					d(b, c, that.key_handler)

				} else {
					console.log(c)
					if (c.size < i || e()) {
						logger.debug("directUpload because file.size < chunk_size || is_android_weixin_or_qq()"),
						d(b, c, that.key_handler)
					} else {
						var j = localStorage.getItem(c.name);
						var k = i;
						if (j) {
							j = that.parseJSON(j);
							var n = (new Date).getTime();
							var o = j.time || 0;
							var q = 86400000;
							q > n - o && 100 !== j.percent && c.size === j.total ? (c.percent = j.percent, c.loaded = j.offset, l = j.ctx, m.isResumeUpload = !0, m.resumeFilesize = j.offset, j.offset + k > c.size && (k = c.size - j.offset)) : localStorage.removeItem(c.name)
						}
						m.startTime = (new Date).getTime();
						var r = {};
						var s = that.detectIEVersion();
						s && 9 >= s && (r.accept = "text/plain; charset=utf-8", logger.debug("add accept text/plain in multipart params")),
						
						b.setOption({
							url: qiniuUploadUrl + "/mkblk/" + k,
							multipart: !1,
							chunk_size: i,
							required_features: "chunks",
							headers: {
								Authorization: "UpToken " + f(c)
							},
							multipart_params: r
						})
					}
				}
			}),
			logger.debug("bind BeforeUpload event"),
			p.bind("UploadProgress",
			function(a, b) {
				logger.trace("UploadProgress event activated"),
				m.currentTime = (new Date).getTime();
				var c = m.currentTime - m.startTime;
				var d = b.loaded || 0;
				m.isResumeUpload && (d = b.loaded - m.resumeFilesize),
				b.speed = (d / c * 1000).toFixed(0) || 0
			}),
			logger.debug("bind UploadProgress event"),
			p.bind("ChunkUploaded",
			function(a, b, c) {
				logger.debug("ChunkUploaded event activated"),
				logger.debug("file: ", b),
				logger.debug("info: ", c);
				var d = that.parseJSON(c.response);
				logger.debug("res: ", d),
				l = l ? l + "," + d.ctx: d.ctx;
				var e = c.total - c.offset;
				var g = a.getOption && a.getOption("chunk_size");
				g = g || a.settings && a.settings.chunk_size,
				g > e && (a.setOption({
					url: qiniuUploadUrl + "/mkblk/" + e
				}), logger.debug("up.setOption url: ", qiniuUploadUrl + "/mkblk/" + e)),
				a.setOption({
					headers: {
						Authorization: "UpToken " + f(b)
					}
				}),
				localStorage.setItem(b.name, that.stringifyJSON({
					ctx: l,
					percent: b.percent,
					total: c.total,
					offset: c.offset,
					time: (new Date).getTime()
				}))
			}),
			logger.debug("bind ChunkUploaded event");
			var q = qiniuUploadUrls.length;
			var r = function(a) {
				return q-->0 ? (setTimeout(function() {
					that.resetUploadUrl(),
					a.status = plupload.QUEUED,
					p.stop(),
					p.start()
				},
				0), !0) : (q = qiniuUploadUrls.length, !1)
			};
			return p.bind("Error",
			function(a) {
				return function(b, c) {
					logger.error("Error event activated"),
					logger.error("err: ", c);
					var d = "";
					var e = c.file;
					if (e) {
						switch (c.code) {
						case plupload.FAILED:
							d = "\u4e0a\u4f20\u5931\u8d25\u3002\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002";
							break;
						case plupload.FILE_SIZE_ERROR:
							var f = b.getOption && b.getOption("max_file_size");
							f = f || b.settings && b.settings.max_file_size,
							d = "\u6d4f\u89c8\u5668\u6700\u5927\u53ef\u4e0a\u4f20" + f + "\u3002\u66f4\u5927\u6587\u4ef6\u8bf7\u4f7f\u7528\u547d\u4ee4\u884c\u5de5\u5177\u3002";
							break;
						case plupload.FILE_EXTENSION_ERROR:
							d = "\u6587\u4ef6\u9a8c\u8bc1\u5931\u8d25\u3002\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002";
							break;
						case plupload.HTTP_ERROR:
							if ("" === c.response) {
								if (d = c.message || "\u672a\u77e5\u7f51\u7edc\u9519\u8bef\u3002", !r(e)) {
									return
								}
								break
							}
							var g = that.parseJSON(c.response);
							var h = g.error;
							switch (c.status) {
							case 400:
								d = "\u8bf7\u6c42\u62a5\u6587\u683c\u5f0f\u9519\u8bef\u3002";
								break;
							case 401:
								d = "\u5ba2\u6237\u7aef\u8ba4\u8bc1\u6388\u6743\u5931\u8d25\u3002\u8bf7\u91cd\u8bd5\u6216\u63d0\u4ea4\u53cd\u9988\u3002";
								break;
							case 405:
								d = "\u5ba2\u6237\u7aef\u8bf7\u6c42\u9519\u8bef\u3002\u8bf7\u91cd\u8bd5\u6216\u63d0\u4ea4\u53cd\u9988\u3002";
								break;
							case 579:
								d = "\u8d44\u6e90\u4e0a\u4f20\u6210\u529f\uff0c\u4f46\u56de\u8c03\u5931\u8d25\u3002";
								break;
							case 599:
								if (d = "\u7f51\u7edc\u8fde\u63a5\u5f02\u5e38\u3002\u8bf7\u91cd\u8bd5\u6216\u63d0\u4ea4\u53cd\u9988\u3002", !r(e)) {
									return
								}
								break;
							case 614:
								d = "\u6587\u4ef6\u5df2\u5b58\u5728\u3002";
								try {
									g = that.parseJSON(g.error),
									h = g.error || "file exists"
								} catch(i) {
									h = g.error || "file exists"
								}
								break;
							case 631:
								d = "\u6307\u5b9a\u7a7a\u95f4\u4e0d\u5b58\u5728\u3002";
								break;
							case 701:
								d = "\u4e0a\u4f20\u6570\u636e\u5757\u6821\u9a8c\u51fa\u9519\u3002\u8bf7\u91cd\u8bd5\u6216\u63d0\u4ea4\u53cd\u9988\u3002";
								break;
							default:
								if (d = "\u672a\u77e5\u9519\u8bef\u3002", !r(e)) {
									return
								}
							}
							d = d + "(" + c.status + "\uff1a" + h + ")";
							break;
						case plupload.SECURITY_ERROR:
							d = "\u5b89\u5168\u914d\u7f6e\u9519\u8bef\u3002\u8bf7\u8054\u7cfb\u7f51\u7ad9\u7ba1\u7406\u5458\u3002";
							break;
						case plupload.GENERIC_ERROR:
							d = "\u4e0a\u4f20\u5931\u8d25\u3002\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002";
							break;
						case plupload.IO_ERROR:
							d = "\u4e0a\u4f20\u5931\u8d25\u3002\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002";
							break;
						case plupload.INIT_ERROR:
							d = "\u7f51\u7ad9\u914d\u7f6e\u9519\u8bef\u3002\u8bf7\u8054\u7cfb\u7f51\u7ad9\u7ba1\u7406\u5458\u3002",
							p.destroy();
							break;
						default:
							if (d = c.message + c.details, !r(e)) {
								return
							}
						}
						a && a(b, c, d)
					}
					b.refresh()
				}
			} (j)),
			logger.debug("bind Error event"),
			p.bind("FileUploaded",
			function(b) {
				return function(c, d, e) {
					logger.debug("FileUploaded event activated"),
					logger.debug("file: ", d),
					logger.debug("info: ", e);
					var f = function(c, d, e) {
						if (a.downtoken_url) {
							var f = that.createAjax();
							f.open("POST", a.downtoken_url, !0),
							f.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
							f.onreadystatechange = function() {
								if (4 === f.readyState) {
									if (200 === f.status) {
										var a;
										try {
											a = that.parseJSON(f.responseText)
										} catch(g) {
											throw "invalid json format"
										}
										var h = {};
										plupload.extend(h, that.parseJSON(e), a),
										b && b(c, d, that.stringifyJSON(h))
									} else {
										p.trigger("Error", {
											status: f.status,
											response: f.responseText,
											file: d,
											code: plupload.HTTP_ERROR
										})
									}
								}
							},
							f.send("key=" + that.parseJSON(e).key + "&domain=" + a.domain)
						} else {
							b && b(c, d, e)
						}
					};
					var g = that.parseJSON(e.response);
					if (l = l ? l: g.ctx, logger.debug("ctx: ", l), l) {
						var i = "";
						logger.debug("save_key: ", a.save_key),
						a.save_key || (i = h(c, d, that.key_handler), i = i ? "/key/" + that.URLSafeBase64Encode(i) : "");
						var j = "/fname/" + that.URLSafeBase64Encode(d.name);
						logger.debug("op.x_vars: ", a.x_vars);
						var k = a.x_vars,
						m = "",
						n = "";
						if (void 0 !== k && "object" == typeof k) {
							for (var o in k) {
								k.hasOwnProperty(o) && ("function" == typeof k[o] ? m = that.URLSafeBase64Encode(k[o](c, d)) : "object" != typeof k[o] && (m = that.URLSafeBase64Encode(k[o])), n += "/x:" + o + "/" + m)
							}
						}
						var q = qiniuUploadUrl + "/mkfile/" + d.size + i + j + n;
						var r = that.detectIEVersion();
						var s;
						// r && 9 >= r ? (s = new mOxie.XMLHttpRequest, mOxie.Env.swf_url = a.flash_swf_url) : s = that.createAjax(),
						s.open("POST", q, !0),
						s.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"),
						s.setRequestHeader("Authorization", "UpToken " + that.token);
						var t = function() {
							if (logger.debug("ajax.readyState: ", s.readyState), 4 === s.readyState) {
								localStorage.removeItem(d.name);
								var a;
								200 === s.status ? (a = s.responseText, logger.debug("mkfile is success: ", a), f(c, d, a)) : (a = {
									status: s.status,
									response: s.responseText,
									file: d,
									code: -200,
									responseHeaders: s.getAllResponseHeaders()
								},
								logger.debug("mkfile is error: ", a), p.trigger("Error", a))
							}
						};
						r && 9 >= r ? s.bind("readystatechange", t) : s.onreadystatechange = t,
						s.send(l),
						logger.debug("mkfile: ", q)
					} else {
						f(c, d, e.response)
					}
				}
			} (k)),
			logger.debug("bind FileUploaded event"),
			p.init(),
			logger.debug("invoke uploader.init()"),
			logger.debug("init uploader end"),
			p
		},
		this.getUrl = function(a) {
			if (!a) {
				return ! 1
			}
			a = encodeURI(a);
			var b = this.domain;
			return "/" !== b.slice(b.length - 1) && (b += "/"),
			b + a
		},
		this.imageView2 = function(a, b) {
			if (!/^\d$/.test(a.mode)) {
				return ! 1
			}
			var c = a.mode,
			d = a.w || "",
			e = a.h || "",
			f = a.q || "",
			g = a.format || "";
			if (!d && !e) {
				return ! 1
			}
			var h = "imageView2/" + c;
			return h += d ? "/w/" + d: "",
			h += e ? "/h/" + e: "",
			h += f ? "/q/" + f: "",
			h += g ? "/format/" + g: "",
			b && (h = this.getUrl(b) + "?" + h),
			h
		},
		this.imageMogr2 = function(a, b) {
			var c = a["auto-orient"] || "",
			d = a.thumbnail || "",
			e = a.strip || "",
			f = a.gravity || "",
			g = a.crop || "",
			h = a.quality || "",
			i = a.rotate || "",
			j = a.format || "",
			k = a.blur || "";
			var l = "imageMogr2";
			return l += c ? "/auto-orient": "",
			l += d ? "/thumbnail/" + d: "",
			l += e ? "/strip": "",
			l += f ? "/gravity/" + f: "",
			l += h ? "/quality/" + h: "",
			l += g ? "/crop/" + g: "",
			l += i ? "/rotate/" + i: "",
			l += j ? "/format/" + j: "",
			l += k ? "/blur/" + k: "",
			b && (l = this.getUrl(b) + "?" + l),
			l
		},
		this.watermark = function(a, b) {
			var c = a.mode;
			if (!c) {
				return ! 1
			}
			var d = "watermark/" + c;
			if (1 === c) {
				var e = a.image || "";
				if (!e) {
					return ! 1
				}
				d += e ? "/image/" + this.URLSafeBase64Encode(e) : ""
			} else {
				if (2 !== c) {
					return ! 1
				}
				var f = a.text ? a.text: "",
				g = a.font ? a.font: "",
				h = a.fontsize ? a.fontsize: "",
				i = a.fill ? a.fill: "";
				if (!f) {
					return ! 1
				}
				d += f ? "/text/" + this.URLSafeBase64Encode(f) : "",
				d += g ? "/font/" + this.URLSafeBase64Encode(g) : "",
				d += h ? "/fontsize/" + h: "",
				d += i ? "/fill/" + this.URLSafeBase64Encode(i) : ""
			}
			var j = a.dissolve || "",
			k = a.gravity || "",
			l = a.dx || "",
			m = a.dy || "";
			return d += j ? "/dissolve/" + j: "",
			d += k ? "/gravity/" + k: "",
			d += l ? "/dx/" + l: "",
			d += m ? "/dy/" + m: "",
			b && (d = this.getUrl(b) + "?" + d),
			d
		},
		this.imageInfo = function(a) {
			if (!a) {
				return ! 1
			}
			var b = this.getUrl(a) + "?imageInfo";
			var c = this.createAjax();
			var d;
			var e = this;
			return c.open("GET", b, !1),
			c.onreadystatechange = function() {
				4 === c.readyState && 200 === c.status && (d = e.parseJSON(c.responseText))
			},
			c.send(),
			d
		},
		this.exif = function(a) {
			if (!a) {
				return ! 1
			}
			var b = this.getUrl(a) + "?exif";
			var c = this.createAjax();
			var d;
			var e = this;
			return c.open("GET", b, !1),
			c.onreadystatechange = function() {
				4 === c.readyState && 200 === c.status && (d = e.parseJSON(c.responseText))
			},
			c.send(),
			d
		},
		this.get = function(a, b) {
			return b && a ? "exif" === a ? this.exif(b) : "imageInfo" === a ? this.imageInfo(b) : !1 : !1
		},
		this.pipeline = function(a, b) {
			var c = "[object Array]" === Object.prototype.toString.call(a);
			var d, e, f = "";
			if (c) {
				for (var g = 0,
				h = a.length; h > g; g++) {
					if (d = a[g], !d.fop) {
						return ! 1
					}
					switch (d.fop) {
					case "watermark":
						f += this.watermark(d) + "|";
						break;
					case "imageView2":
						f += this.imageView2(d) + "|";
						break;
					case "imageMogr2":
						f += this.imageMogr2(d) + "|";
						break;
					default:
						e = !0
					}
					if (e) {
						return ! 1
					}
				}
				if (b) {
					f = this.getUrl(b) + "?" + f;
					var i = f.length;
					"|" === f.slice(i - 1) && (f = f.slice(0, i - 1))
				}
				return f
			}
			return ! 1
		}
	}
	var Qiniu = new QiniuJsSDK;
	global.Qiniu = Qiniu,
	global.QiniuJsSDK = QiniuJsSDK
} (window);
/* Phaser v2.4.3 - http://phaser.io - @photonstorm - (c) 2015 Photon Storm Ltd. */

(function() {
    var a = this
      , b = b || {};
    return b.WEBGL_RENDERER = 0,
    b.CANVAS_RENDERER = 1,
    b.VERSION = "v2.2.8",
    b._UID = 0,
    "undefined" != typeof Float32Array ? (b.Float32Array = Float32Array,
    b.Uint16Array = Uint16Array,
    b.Uint32Array = Uint32Array,
    b.ArrayBuffer = ArrayBuffer) : (b.Float32Array = Array,
    b.Uint16Array = Array),
    b.PI_2 = 2 * Math.PI,
    b.RAD_TO_DEG = 180 / Math.PI,
    b.DEG_TO_RAD = Math.PI / 180,
    b.RETINA_PREFIX = "@2x",
    b.defaultRenderOptions = {
        view: null,
        transparent: !1,
        antialias: !1,
        preserveDrawingBuffer: !1,
        resolution: 1,
        clearBeforeRender: !0,
        autoResize: !1
    },
    b.DisplayObject = function() {
        this.position = new b.Point(0,0),
        this.scale = new b.Point(1,1),
        this.transformCallback = null,
        this.transformCallbackContext = null,
        this.pivot = new b.Point(0,0),
        this.rotation = 0,
        this.alpha = 1,
        this.visible = !0,
        this.hitArea = null,
        this.renderable = !1,
        this.parent = null,
        this.stage = null,
        this.worldAlpha = 1,
        this.worldTransform = new b.Matrix,
        this.worldPosition = new b.Point(0,0),
        this.worldScale = new b.Point(1,1),
        this.worldRotation = 0,
        this._sr = 0,
        this._cr = 1,
        this.filterArea = null,
        this._bounds = new b.Rectangle(0,0,1,1),
        this._currentBounds = null,
        this._mask = null,
        this._cacheAsBitmap = !1,
        this._cacheIsDirty = !1
    }
    ,
    b.DisplayObject.prototype.constructor = b.DisplayObject,
    b.DisplayObject.prototype.destroy = function() {
        if (this.children) {
            for (var a = this.children.length; a--; )
                this.children[a].destroy();
            this.children = []
        }
        this.transformCallback = null,
        this.transformCallbackContext = null,
        this.hitArea = null,
        this.parent = null,
        this.stage = null,
        this.worldTransform = null,
        this.filterArea = null,
        this._bounds = null,
        this._currentBounds = null,
        this._mask = null,
        this.renderable = !1,
        this._destroyCachedSprite()
    }
    ,
    Object.defineProperty(b.DisplayObject.prototype, "worldVisible", {
        get: function() {
            var a = this;
            do {
                if (!a.visible)
                    return !1;
                a = a.parent
            } while (a);
            return !0
        }
    }),
    Object.defineProperty(b.DisplayObject.prototype, "mask", {
        get: function() {
            return this._mask
        },
        set: function(a) {
            this._mask && (this._mask.isMask = !1),
            this._mask = a,
            this._mask && (this._mask.isMask = !0)
        }
    }),
    Object.defineProperty(b.DisplayObject.prototype, "filters", {
        get: function() {
            return this._filters
        },
        set: function(a) {
            if (a) {
                for (var c = [], d = 0; d < a.length; d++)
                    for (var e = a[d].passes, f = 0; f < e.length; f++)
                        c.push(e[f]);
                this._filterBlock = {
                    target: this,
                    filterPasses: c
                }
            }
            this._filters = a,
            this.blendMode && this.blendMode === b.blendModes.MULTIPLY && (this.blendMode = b.blendModes.NORMAL)
        }
    }),
    Object.defineProperty(b.DisplayObject.prototype, "cacheAsBitmap", {
        get: function() {
            return this._cacheAsBitmap
        },
        set: function(a) {
            this._cacheAsBitmap !== a && (a ? this._generateCachedSprite() : this._destroyCachedSprite(),
            this._cacheAsBitmap = a)
        }
    }),
    b.DisplayObject.prototype.updateTransform = function(a) {
        if (a || this.parent || this.game) {
            var c = this.parent;
            a ? c = a : this.parent || (c = this.game.world);
            var d, e, f, g, h, i, j = c.worldTransform, k = this.worldTransform;
            this.rotation % b.PI_2 ? (this.rotation !== this.rotationCache && (this.rotationCache = this.rotation,
            this._sr = Math.sin(this.rotation),
            this._cr = Math.cos(this.rotation)),
            d = this._cr * this.scale.x,
            e = this._sr * this.scale.x,
            f = -this._sr * this.scale.y,
            g = this._cr * this.scale.y,
            h = this.position.x,
            i = this.position.y,
            (this.pivot.x || this.pivot.y) && (h -= this.pivot.x * d + this.pivot.y * f,
            i -= this.pivot.x * e + this.pivot.y * g),
            k.a = d * j.a + e * j.c,
            k.b = d * j.b + e * j.d,
            k.c = f * j.a + g * j.c,
            k.d = f * j.b + g * j.d,
            k.tx = h * j.a + i * j.c + j.tx,
            k.ty = h * j.b + i * j.d + j.ty) : (d = this.scale.x,
            g = this.scale.y,
            h = this.position.x - this.pivot.x * d,
            i = this.position.y - this.pivot.y * g,
            k.a = d * j.a,
            k.b = d * j.b,
            k.c = g * j.c,
            k.d = g * j.d,
            k.tx = h * j.a + i * j.c + j.tx,
            k.ty = h * j.b + i * j.d + j.ty),
            this.worldAlpha = this.alpha * c.worldAlpha,
            this.worldPosition.set(k.tx, k.ty),
            this.worldScale.set(Math.sqrt(k.a * k.a + k.b * k.b), Math.sqrt(k.c * k.c + k.d * k.d)),
            this.worldRotation = Math.atan2(-k.c, k.d),
            this._currentBounds = null,
            this.transformCallback && this.transformCallback.call(this.transformCallbackContext, k, j)
        }
    }
    ,
    b.DisplayObject.prototype.displayObjectUpdateTransform = b.DisplayObject.prototype.updateTransform,
    b.DisplayObject.prototype.getBounds = function(a) {
        return a = a,
        b.EmptyRectangle
    }
    ,
    b.DisplayObject.prototype.getLocalBounds = function() {
        return this.getBounds(b.identityMatrix)
    }
    ,
    b.DisplayObject.prototype.setStageReference = function(a) {
        this.stage = a
    }
    ,
    b.DisplayObject.prototype.preUpdate = function() {}
    ,
    b.DisplayObject.prototype.generateTexture = function(a, c, d) {
        var e = this.getLocalBounds()
          , f = new b.RenderTexture(0 | e.width,0 | e.height,d,c,a);
        return b.DisplayObject._tempMatrix.tx = -e.x,
        b.DisplayObject._tempMatrix.ty = -e.y,
        f.render(this, b.DisplayObject._tempMatrix),
        f
    }
    ,
    b.DisplayObject.prototype.updateCache = function() {
        this._generateCachedSprite()
    }
    ,
    b.DisplayObject.prototype.toGlobal = function(a) {
        return this.displayObjectUpdateTransform(),
        this.worldTransform.apply(a)
    }
    ,
    b.DisplayObject.prototype.toLocal = function(a, b) {
        return b && (a = b.toGlobal(a)),
        this.displayObjectUpdateTransform(),
        this.worldTransform.applyInverse(a)
    }
    ,
    b.DisplayObject.prototype._renderCachedSprite = function(a) {
        this._cachedSprite.worldAlpha = this.worldAlpha,
        a.gl ? b.Sprite.prototype._renderWebGL.call(this._cachedSprite, a) : b.Sprite.prototype._renderCanvas.call(this._cachedSprite, a)
    }
    ,
    b.DisplayObject.prototype._generateCachedSprite = function() {
        this._cacheAsBitmap = !1;
        var a = this.getLocalBounds();
        if (this.updateTransform(),
        this._cachedSprite)
            this._cachedSprite.texture.resize(1 | a.width, 1 | a.height);
        else {
            var c = new b.RenderTexture(1 | a.width,1 | a.height);
            this._cachedSprite = new b.Sprite(c),
            this._cachedSprite.worldTransform = this.worldTransform
        }
        var d = this._filters;
        this._filters = null,
        this._cachedSprite.filters = d,
        b.DisplayObject._tempMatrix.tx = -a.x,
        b.DisplayObject._tempMatrix.ty = -a.y,
        this._cachedSprite.texture.render(this, b.DisplayObject._tempMatrix, !0),
        this._cachedSprite.anchor.x = -(a.x / a.width),
        this._cachedSprite.anchor.y = -(a.y / a.height),
        this._filters = d,
        this._cacheAsBitmap = !0
    }
    ,
    b.DisplayObject.prototype._destroyCachedSprite = function() {
        this._cachedSprite && (this._cachedSprite.texture.destroy(!0),
        this._cachedSprite = null)
    }
    ,
    b.DisplayObject.prototype._renderWebGL = function(a) {
        a = a
    }
    ,
    b.DisplayObject.prototype._renderCanvas = function(a) {
        a = a
    }
    ,
    Object.defineProperty(b.DisplayObject.prototype, "x", {
        get: function() {
            return this.position.x
        },
        set: function(a) {
            this.position.x = a
        }
    }),
    Object.defineProperty(b.DisplayObject.prototype, "y", {
        get: function() {
            return this.position.y
        },
        set: function(a) {
            this.position.y = a
        }
    }),
    b.DisplayObjectContainer = function() {
        b.DisplayObject.call(this),
        this.children = []
    }
    ,
    b.DisplayObjectContainer.prototype = Object.create(b.DisplayObject.prototype),
    b.DisplayObjectContainer.prototype.constructor = b.DisplayObjectContainer,
    Object.defineProperty(b.DisplayObjectContainer.prototype, "width", {
        get: function() {
            return this.scale.x * this.getLocalBounds().width
        },
        set: function(a) {
            var b = this.getLocalBounds().width;
            this.scale.x = 0 !== b ? a / b : 1,
            this._width = a
        }
    }),
    Object.defineProperty(b.DisplayObjectContainer.prototype, "height", {
        get: function() {
            return this.scale.y * this.getLocalBounds().height
        },
        set: function(a) {
            var b = this.getLocalBounds().height;
            this.scale.y = 0 !== b ? a / b : 1,
            this._height = a
        }
    }),
    b.DisplayObjectContainer.prototype.addChild = function(a) {
        return this.addChildAt(a, this.children.length)
    }
    ,
    b.DisplayObjectContainer.prototype.addChildAt = function(a, b) {
        if (b >= 0 && b <= this.children.length)
            return a.parent && a.parent.removeChild(a),
            a.parent = this,
            this.children.splice(b, 0, a),
            this.stage && a.setStageReference(this.stage),
            a;
        throw new Error(a + "addChildAt: The index " + b + " supplied is out of bounds " + this.children.length)
    }
    ,
    b.DisplayObjectContainer.prototype.swapChildren = function(a, b) {
        if (a !== b) {
            var c = this.getChildIndex(a)
              , d = this.getChildIndex(b);
            if (0 > c || 0 > d)
                throw new Error("swapChildren: Both the supplied DisplayObjects must be a child of the caller.");
            this.children[c] = b,
            this.children[d] = a
        }
    }
    ,
    b.DisplayObjectContainer.prototype.getChildIndex = function(a) {
        var b = this.children.indexOf(a);
        if (-1 === b)
            throw new Error("The supplied DisplayObject must be a child of the caller");
        return b
    }
    ,
    b.DisplayObjectContainer.prototype.setChildIndex = function(a, b) {
        if (0 > b || b >= this.children.length)
            throw new Error("The supplied index is out of bounds");
        var c = this.getChildIndex(a);
        this.children.splice(c, 1),
        this.children.splice(b, 0, a)
    }
    ,
    b.DisplayObjectContainer.prototype.getChildAt = function(a) {
        if (0 > a || a >= this.children.length)
            throw new Error("getChildAt: Supplied index " + a + " does not exist in the child list, or the supplied DisplayObject must be a child of the caller");
        return this.children[a]
    }
    ,
    b.DisplayObjectContainer.prototype.removeChild = function(a) {
        var b = this.children.indexOf(a);
        if (-1 !== b)
            return this.removeChildAt(b)
    }
    ,
    b.DisplayObjectContainer.prototype.removeChildAt = function(a) {
        var b = this.getChildAt(a);
        return this.stage && b.removeStageReference(),
        b.parent = void 0,
        this.children.splice(a, 1),
        b
    }
    ,
    b.DisplayObjectContainer.prototype.removeChildren = function(a, b) {
        var c = a || 0
          , d = "number" == typeof b ? b : this.children.length
          , e = d - c;
        if (e > 0 && d >= e) {
            for (var f = this.children.splice(c, e), g = 0; g < f.length; g++) {
                var h = f[g];
                this.stage && h.removeStageReference(),
                h.parent = void 0
            }
            return f
        }
        if (0 === e && 0 === this.children.length)
            return [];
        throw new Error("removeChildren: Range Error, numeric values are outside the acceptable range")
    }
    ,
    b.DisplayObjectContainer.prototype.updateTransform = function() {
        if (this.visible && (this.displayObjectUpdateTransform(),
        !this._cacheAsBitmap))
            for (var a = 0; a < this.children.length; a++)
                this.children[a].updateTransform()
    }
    ,
    b.DisplayObjectContainer.prototype.displayObjectContainerUpdateTransform = b.DisplayObjectContainer.prototype.updateTransform,
    b.DisplayObjectContainer.prototype.getBounds = function() {
        if (0 === this.children.length)
            return b.EmptyRectangle;
        for (var a, c, d, e = 1 / 0, f = 1 / 0, g = -1 / 0, h = -1 / 0, i = !1, j = 0, k = this.children.length; k > j; j++) {
            var l = this.children[j];
            l.visible && (i = !0,
            a = this.children[j].getBounds(),
            e = e < a.x ? e : a.x,
            f = f < a.y ? f : a.y,
            c = a.width + a.x,
            d = a.height + a.y,
            g = g > c ? g : c,
            h = h > d ? h : d)
        }
        if (!i)
            return b.EmptyRectangle;
        var m = this._bounds;
        return m.x = e,
        m.y = f,
        m.width = g - e,
        m.height = h - f,
        m
    }
    ,
    b.DisplayObjectContainer.prototype.getLocalBounds = function() {
        var a = this.worldTransform;
        this.worldTransform = b.identityMatrix;
        for (var c = 0, d = this.children.length; d > c; c++)
            this.children[c].updateTransform();
        var e = this.getBounds();
        return this.worldTransform = a,
        e
    }
    ,
    b.DisplayObjectContainer.prototype.setStageReference = function(a) {
        this.stage = a;
        for (var b = 0; b < this.children.length; b++)
            this.children[b].setStageReference(a)
    }
    ,
    b.DisplayObjectContainer.prototype.removeStageReference = function() {
        for (var a = 0; a < this.children.length; a++)
            this.children[a].removeStageReference();
        this.stage = null
    }
    ,
    b.DisplayObjectContainer.prototype._renderWebGL = function(a) {
        if (this.visible && !(this.alpha <= 0)) {
            if (this._cacheAsBitmap)
                return void this._renderCachedSprite(a);
            var b;
            if (this._mask || this._filters) {
                for (this._filters && (a.spriteBatch.flush(),
                a.filterManager.pushFilter(this._filterBlock)),
                this._mask && (a.spriteBatch.stop(),
                a.maskManager.pushMask(this.mask, a),
                a.spriteBatch.start()),
                b = 0; b < this.children.length; b++)
                    this.children[b]._renderWebGL(a);
                a.spriteBatch.stop(),
                this._mask && a.maskManager.popMask(this._mask, a),
                this._filters && a.filterManager.popFilter(),
                a.spriteBatch.start()
            } else
                for (b = 0; b < this.children.length; b++)
                    this.children[b]._renderWebGL(a)
        }
    }
    ,
    b.DisplayObjectContainer.prototype._renderCanvas = function(a) {
        if (this.visible !== !1 && 0 !== this.alpha) {
            if (this._cacheAsBitmap)
                return void this._renderCachedSprite(a);
            this._mask && a.maskManager.pushMask(this._mask, a);
            for (var b = 0; b < this.children.length; b++)
                this.children[b]._renderCanvas(a);
            this._mask && a.maskManager.popMask(a)
        }
    }
    ,
    b.Sprite = function(a) {
        b.DisplayObjectContainer.call(this),
        this.anchor = new b.Point,
        this.texture = a || b.Texture.emptyTexture,
        this._width = 0,
        this._height = 0,
        this.tint = 16777215,
        this.cachedTint = -1,
        this.tintedTexture = null,
        this.blendMode = b.blendModes.NORMAL,
        this.shader = null,
        this.texture.baseTexture.hasLoaded && this.onTextureUpdate(),
        this.renderable = !0
    }
    ,
    b.Sprite.prototype = Object.create(b.DisplayObjectContainer.prototype),
    b.Sprite.prototype.constructor = b.Sprite,
    Object.defineProperty(b.Sprite.prototype, "width", {
        get: function() {
            return this.scale.x * this.texture.frame.width
        },
        set: function(a) {
            this.scale.x = a / this.texture.frame.width,
            this._width = a
        }
    }),
    Object.defineProperty(b.Sprite.prototype, "height", {
        get: function() {
            return this.scale.y * this.texture.frame.height
        },
        set: function(a) {
            this.scale.y = a / this.texture.frame.height,
            this._height = a
        }
    }),
    b.Sprite.prototype.setTexture = function(a, b) {
        void 0 !== b && this.texture.baseTexture.destroy(),
        this.texture = a,
        this.texture.valid = !0
    }
    ,
    b.Sprite.prototype.onTextureUpdate = function() {
        this._width && (this.scale.x = this._width / this.texture.frame.width),
        this._height && (this.scale.y = this._height / this.texture.frame.height)
    }
    ,
    b.Sprite.prototype.getBounds = function(a) {
        var b = this.texture.frame.width
          , c = this.texture.frame.height
          , d = b * (1 - this.anchor.x)
          , e = b * -this.anchor.x
          , f = c * (1 - this.anchor.y)
          , g = c * -this.anchor.y
          , h = a || this.worldTransform
          , i = h.a
          , j = h.b
          , k = h.c
          , l = h.d
          , m = h.tx
          , n = h.ty
          , o = -1 / 0
          , p = -1 / 0
          , q = 1 / 0
          , r = 1 / 0;
        if (0 === j && 0 === k)
            0 > i && (i *= -1),
            0 > l && (l *= -1),
            q = i * e + m,
            o = i * d + m,
            r = l * g + n,
            p = l * f + n;
        else {
            var s = i * e + k * g + m
              , t = l * g + j * e + n
              , u = i * d + k * g + m
              , v = l * g + j * d + n
              , w = i * d + k * f + m
              , x = l * f + j * d + n
              , y = i * e + k * f + m
              , z = l * f + j * e + n;
            q = q > s ? s : q,
            q = q > u ? u : q,
            q = q > w ? w : q,
            q = q > y ? y : q,
            r = r > t ? t : r,
            r = r > v ? v : r,
            r = r > x ? x : r,
            r = r > z ? z : r,
            o = s > o ? s : o,
            o = u > o ? u : o,
            o = w > o ? w : o,
            o = y > o ? y : o,
            p = t > p ? t : p,
            p = v > p ? v : p,
            p = x > p ? x : p,
            p = z > p ? z : p
        }
        var A = this._bounds;
        return A.x = q,
        A.width = o - q,
        A.y = r,
        A.height = p - r,
        this._currentBounds = A,
        A
    }
    ,
    b.Sprite.prototype._renderWebGL = function(a, b) {
        if (this.visible && !(this.alpha <= 0) && this.renderable) {
            var c = this.worldTransform;
            if (b && (c = b),
            this._mask || this._filters) {
                var d = a.spriteBatch;
                this._filters && (d.flush(),
                a.filterManager.pushFilter(this._filterBlock)),
                this._mask && (d.stop(),
                a.maskManager.pushMask(this.mask, a),
                d.start()),
                d.render(this);
                for (var e = 0; e < this.children.length; e++)
                    this.children[e]._renderWebGL(a);
                d.stop(),
                this._mask && a.maskManager.popMask(this._mask, a),
                this._filters && a.filterManager.popFilter(),
                d.start()
            } else {
                a.spriteBatch.render(this);
                for (var e = 0; e < this.children.length; e++)
                    this.children[e]._renderWebGL(a, c)
            }
        }
    }
    ,
    b.Sprite.prototype._renderCanvas = function(a, c) {
        if (!(this.visible === !1 || 0 === this.alpha || this.renderable === !1 || this.texture.crop.width <= 0 || this.texture.crop.height <= 0)) {
            var d = this.worldTransform;
            if (c && (d = c),
            this.blendMode !== a.currentBlendMode && (a.currentBlendMode = this.blendMode,
            a.context.globalCompositeOperation = b.blendModesCanvas[a.currentBlendMode]),
            this._mask && a.maskManager.pushMask(this._mask, a),
            this.texture.valid) {
                var e = this.texture.baseTexture.resolution / a.resolution;
                a.context.globalAlpha = this.worldAlpha,
                a.smoothProperty && a.scaleMode !== this.texture.baseTexture.scaleMode && (a.scaleMode = this.texture.baseTexture.scaleMode,
                a.context[a.smoothProperty] = a.scaleMode === b.scaleModes.LINEAR);
                var f = this.texture.trim ? this.texture.trim.x - this.anchor.x * this.texture.trim.width : this.anchor.x * -this.texture.frame.width
                  , g = this.texture.trim ? this.texture.trim.y - this.anchor.y * this.texture.trim.height : this.anchor.y * -this.texture.frame.height;
                a.roundPixels ? (a.context.setTransform(d.a, d.b, d.c, d.d, d.tx * a.resolution | 0, d.ty * a.resolution | 0),
                f |= 0,
                g |= 0) : a.context.setTransform(d.a, d.b, d.c, d.d, d.tx * a.resolution, d.ty * a.resolution);
                var h = this.texture.crop.width
                  , i = this.texture.crop.height;
                if (f /= e,
                g /= e,
                16777215 !== this.tint)
                    (this.texture.requiresReTint || this.cachedTint !== this.tint) && (this.tintedTexture = b.CanvasTinter.getTintedTexture(this, this.tint),
                    this.cachedTint = this.tint),
                    a.context.drawImage(this.tintedTexture, 0, 0, h, i, f, g, h / e, i / e);
                else {
                    var j = this.texture.crop.x
                      , k = this.texture.crop.y;
                    a.context.drawImage(this.texture.baseTexture.source, j, k, h, i, f, g, h / e, i / e)
                }
            }
            for (var l = 0; l < this.children.length; l++)
                this.children[l]._renderCanvas(a);
            this._mask && a.maskManager.popMask(a)
        }
    }
    ,
    b.Sprite.fromFrame = function(a) {
        var c = b.TextureCache[a];
        if (!c)
            throw new Error('The frameId "' + a + '" does not exist in the texture cache' + this);
        return new b.Sprite(c)
    }
    ,
    b.Sprite.fromImage = function(a, c, d) {
        var e = b.Texture.fromImage(a, c, d);
        return new b.Sprite(e)
    }
    ,
    b.SpriteBatch = function(a) {
        b.DisplayObjectContainer.call(this),
        this.textureThing = a,
        this.ready = !1
    }
    ,
    b.SpriteBatch.prototype = Object.create(b.DisplayObjectContainer.prototype),
    b.SpriteBatch.prototype.constructor = b.SpriteBatch,
    b.SpriteBatch.prototype.initWebGL = function(a) {
        this.fastSpriteBatch = new b.WebGLFastSpriteBatch(a),
        this.ready = !0
    }
    ,
    b.SpriteBatch.prototype.updateTransform = function() {
        this.displayObjectUpdateTransform()
    }
    ,
    b.SpriteBatch.prototype._renderWebGL = function(a) {
        !this.visible || this.alpha <= 0 || !this.children.length || (this.ready || this.initWebGL(a.gl),
        this.fastSpriteBatch.gl !== a.gl && this.fastSpriteBatch.setContext(a.gl),
        a.spriteBatch.stop(),
        a.shaderManager.setShader(a.shaderManager.fastShader),
        this.fastSpriteBatch.begin(this, a),
        this.fastSpriteBatch.render(this),
        a.spriteBatch.start())
    }
    ,
    b.SpriteBatch.prototype._renderCanvas = function(a) {
        if (this.visible && !(this.alpha <= 0) && this.children.length) {
            var b = a.context;
            b.globalAlpha = this.worldAlpha,
            this.displayObjectUpdateTransform();
            for (var c = this.worldTransform, d = !0, e = 0; e < this.children.length; e++) {
                var f = this.children[e];
                if (f.visible) {
                    var g = f.texture
                      , h = g.frame;
                    if (b.globalAlpha = this.worldAlpha * f.alpha,
                    f.rotation % (2 * Math.PI) === 0)
                        d && (b.setTransform(c.a, c.b, c.c, c.d, c.tx, c.ty),
                        d = !1),
                        b.drawImage(g.baseTexture.source, h.x, h.y, h.width, h.height, f.anchor.x * -h.width * f.scale.x + f.position.x + .5 | 0, f.anchor.y * -h.height * f.scale.y + f.position.y + .5 | 0, h.width * f.scale.x, h.height * f.scale.y);
                    else {
                        d || (d = !0),
                        f.displayObjectUpdateTransform();
                        var i = f.worldTransform;
                        a.roundPixels ? b.setTransform(i.a, i.b, i.c, i.d, 0 | i.tx, 0 | i.ty) : b.setTransform(i.a, i.b, i.c, i.d, i.tx, i.ty),
                        b.drawImage(g.baseTexture.source, h.x, h.y, h.width, h.height, f.anchor.x * -h.width + .5 | 0, f.anchor.y * -h.height + .5 | 0, h.width, h.height)
                    }
                }
            }
        }
    }
    ,
    b.Stage = function(a) {
        b.DisplayObjectContainer.call(this),
        this.worldTransform = new b.Matrix,
        this.stage = this,
        this.setBackgroundColor(a)
    }
    ,
    b.Stage.prototype = Object.create(b.DisplayObjectContainer.prototype),
    b.Stage.prototype.constructor = b.Stage,
    b.Stage.prototype.updateTransform = function() {
        this.worldAlpha = 1;
        for (var a = 0; a < this.children.length; a++)
            this.children[a].updateTransform()
    }
    ,
    b.Stage.prototype.setBackgroundColor = function(a) {
        this.backgroundColor = a || 0,
        this.backgroundColorSplit = b.hex2rgb(this.backgroundColor);
        var c = this.backgroundColor.toString(16);
        c = "000000".substr(0, 6 - c.length) + c,
        this.backgroundColorString = "#" + c
    }
    ,
    b.hex2rgb = function(a) {
        return [(a >> 16 & 255) / 255, (a >> 8 & 255) / 255, (255 & a) / 255]
    }
    ,
    b.rgb2hex = function(a) {
        return (255 * a[0] << 16) + (255 * a[1] << 8) + 255 * a[2]
    }
    ,
    b.canUseNewCanvasBlendModes = function() {
        if (void 0 === document)
            return !1;
        var a = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAABAQMAAADD8p2OAAAAA1BMVEX/"
          , c = "AAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg=="
          , d = new Image;
        d.src = a + "AP804Oa6" + c;
        var e = new Image;
        e.src = a + "/wCKxvRF" + c;
        var f = b.CanvasPool.create(this, 6, 1)
          , g = f.getContext("2d");
        if (g.globalCompositeOperation = "multiply",
        g.drawImage(d, 0, 0),
        g.drawImage(e, 2, 0),
        !g.getImageData(2, 0, 1, 1))
            return !1;
        var h = g.getImageData(2, 0, 1, 1).data;
        return b.CanvasPool.remove(this),
        255 === h[0] && 0 === h[1] && 0 === h[2]
    }
    ,
    b.getNextPowerOfTwo = function(a) {
        if (a > 0 && 0 === (a & a - 1))
            return a;
        for (var b = 1; a > b; )
            b <<= 1;
        return b
    }
    ,
    b.isPowerOfTwo = function(a, b) {
        return a > 0 && 0 === (a & a - 1) && b > 0 && 0 === (b & b - 1)
    }
    ,
    b.PolyK = {},
    b.PolyK.Triangulate = function(a) {
        var c = !0
          , d = a.length >> 1;
        if (3 > d)
            return [];
        for (var e = [], f = [], g = 0; d > g; g++)
            f.push(g);
        g = 0;
        for (var h = d; h > 3; ) {
            var i = f[(g + 0) % h]
              , j = f[(g + 1) % h]
              , k = f[(g + 2) % h]
              , l = a[2 * i]
              , m = a[2 * i + 1]
              , n = a[2 * j]
              , o = a[2 * j + 1]
              , p = a[2 * k]
              , q = a[2 * k + 1]
              , r = !1;
            if (b.PolyK._convex(l, m, n, o, p, q, c)) {
                r = !0;
                for (var s = 0; h > s; s++) {
                    var t = f[s];
                    if (t !== i && t !== j && t !== k && b.PolyK._PointInTriangle(a[2 * t], a[2 * t + 1], l, m, n, o, p, q)) {
                        r = !1;
                        break
                    }
                }
            }
            if (r)
                e.push(i, j, k),
                f.splice((g + 1) % h, 1),
                h--,
                g = 0;
            else if (g++ > 3 * h) {
                if (!c)
                    return null;
                for (e = [],
                f = [],
                g = 0; d > g; g++)
                    f.push(g);
                g = 0,
                h = d,
                c = !1
            }
        }
        return e.push(f[0], f[1], f[2]),
        e
    }
    ,
    b.PolyK._PointInTriangle = function(a, b, c, d, e, f, g, h) {
        var i = g - c
          , j = h - d
          , k = e - c
          , l = f - d
          , m = a - c
          , n = b - d
          , o = i * i + j * j
          , p = i * k + j * l
          , q = i * m + j * n
          , r = k * k + l * l
          , s = k * m + l * n
          , t = 1 / (o * r - p * p)
          , u = (r * q - p * s) * t
          , v = (o * s - p * q) * t;
        return u >= 0 && v >= 0 && 1 > u + v
    }
    ,
    b.PolyK._convex = function(a, b, c, d, e, f, g) {
        return (b - d) * (e - c) + (c - a) * (f - d) >= 0 === g
    }
    ,
    b.CanvasPool = {
        create: function(a, c, d) {
            var e, f = b.CanvasPool.getFirst();
            if (-1 === f) {
                var g = {
                    parent: a,
                    canvas: document.createElement("canvas")
                };
                b.CanvasPool.pool.push(g),
                e = g.canvas
            } else
                b.CanvasPool.pool[f].parent = a,
                e = b.CanvasPool.pool[f].canvas;
            return void 0 !== c && (e.width = c,
            e.height = d),
            e
        },
        getFirst: function() {
            for (var a = b.CanvasPool.pool, c = 0; c < a.length; c++)
                if (null === a[c].parent)
                    return c;
            return -1
        },
        remove: function(a) {
            for (var c = b.CanvasPool.pool, d = 0; d < c.length; d++)
                c[d].parent === a && (c[d].parent = null)
        },
        removeByCanvas: function(a) {
            for (var c = b.CanvasPool.pool, d = 0; d < c.length; d++)
                c[d].canvas === a && (c[d].parent = null)
        },
        getTotal: function() {
            for (var a = b.CanvasPool.pool, c = 0, d = 0; d < a.length; d++)
                null !== a[d].parent && c++;
            return c
        },
        getFree: function() {
            for (var a = b.CanvasPool.pool, c = 0, d = 0; d < a.length; d++)
                null === a[d].parent && c++;
            return c
        }
    },
    b.CanvasPool.pool = [],
    b.initDefaultShaders = function() {}
    ,
    b.CompileVertexShader = function(a, c) {
        return b._CompileShader(a, c, a.VERTEX_SHADER)
    }
    ,
    b.CompileFragmentShader = function(a, c) {
        return b._CompileShader(a, c, a.FRAGMENT_SHADER)
    }
    ,
    b._CompileShader = function(a, b, c) {
        var d = b;
        Array.isArray(b) && (d = b.join("\n"));
        var e = a.createShader(c);
        return a.shaderSource(e, d),
        a.compileShader(e),
        a.getShaderParameter(e, a.COMPILE_STATUS) ? e : (window.console.log(a.getShaderInfoLog(e)),
        null)
    }
    ,
    b.compileProgram = function(a, c, d) {
        var e = b.CompileFragmentShader(a, d)
          , f = b.CompileVertexShader(a, c)
          , g = a.createProgram();
        return a.attachShader(g, f),
        a.attachShader(g, e),
        a.linkProgram(g),
        a.getProgramParameter(g, a.LINK_STATUS) || window.console.log("Could not initialise shaders"),
        g
    }
    ,
    b.PixiShader = function(a) {
        this._UID = b._UID++,
        this.gl = a,
        this.program = null,
        this.fragmentSrc = ["precision lowp float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;", "}"],
        this.textureCount = 0,
        this.firstRun = !0,
        this.dirty = !0,
        this.attributes = [],
        this.init()
    }
    ,
    b.PixiShader.prototype.constructor = b.PixiShader,
    b.PixiShader.prototype.init = function() {
        var a = this.gl
          , c = b.compileProgram(a, this.vertexSrc || b.PixiShader.defaultVertexSrc, this.fragmentSrc);
        a.useProgram(c),
        this.uSampler = a.getUniformLocation(c, "uSampler"),
        this.projectionVector = a.getUniformLocation(c, "projectionVector"),
        this.offsetVector = a.getUniformLocation(c, "offsetVector"),
        this.dimensions = a.getUniformLocation(c, "dimensions"),
        this.aVertexPosition = a.getAttribLocation(c, "aVertexPosition"),
        this.aTextureCoord = a.getAttribLocation(c, "aTextureCoord"),
        this.colorAttribute = a.getAttribLocation(c, "aColor"),
        -1 === this.colorAttribute && (this.colorAttribute = 2),
        this.attributes = [this.aVertexPosition, this.aTextureCoord, this.colorAttribute];
        for (var d in this.uniforms)
            this.uniforms[d].uniformLocation = a.getUniformLocation(c, d);
        this.initUniforms(),
        this.program = c
    }
    ,
    b.PixiShader.prototype.initUniforms = function() {
        this.textureCount = 1;
        var a, b = this.gl;
        for (var c in this.uniforms) {
            a = this.uniforms[c];
            var d = a.type;
            "sampler2D" === d ? (a._init = !1,
            null !== a.value && this.initSampler2D(a)) : "mat2" === d || "mat3" === d || "mat4" === d ? (a.glMatrix = !0,
            a.glValueLength = 1,
            "mat2" === d ? a.glFunc = b.uniformMatrix2fv : "mat3" === d ? a.glFunc = b.uniformMatrix3fv : "mat4" === d && (a.glFunc = b.uniformMatrix4fv)) : (a.glFunc = b["uniform" + d],
            a.glValueLength = "2f" === d || "2i" === d ? 2 : "3f" === d || "3i" === d ? 3 : "4f" === d || "4i" === d ? 4 : 1)
        }
    }
    ,
    b.PixiShader.prototype.initSampler2D = function(a) {
        if (a.value && a.value.baseTexture && a.value.baseTexture.hasLoaded) {
            var b = this.gl;
            if (b.activeTexture(b["TEXTURE" + this.textureCount]),
            b.bindTexture(b.TEXTURE_2D, a.value.baseTexture._glTextures[b.id]),
            a.textureData) {
                var c = a.textureData
                  , d = c.magFilter ? c.magFilter : b.LINEAR
                  , e = c.minFilter ? c.minFilter : b.LINEAR
                  , f = c.wrapS ? c.wrapS : b.CLAMP_TO_EDGE
                  , g = c.wrapT ? c.wrapT : b.CLAMP_TO_EDGE
                  , h = c.luminance ? b.LUMINANCE : b.RGBA;
                if (c.repeat && (f = b.REPEAT,
                g = b.REPEAT),
                b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, !!c.flipY),
                c.width) {
                    var i = c.width ? c.width : 512
                      , j = c.height ? c.height : 2
                      , k = c.border ? c.border : 0;
                    b.texImage2D(b.TEXTURE_2D, 0, h, i, j, k, h, b.UNSIGNED_BYTE, null)
                } else
                    b.texImage2D(b.TEXTURE_2D, 0, h, b.RGBA, b.UNSIGNED_BYTE, a.value.baseTexture.source);
                b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, d),
                b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, e),
                b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, f),
                b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, g)
            }
            b.uniform1i(a.uniformLocation, this.textureCount),
            a._init = !0,
            this.textureCount++
        }
    }
    ,
    b.PixiShader.prototype.syncUniforms = function() {
        this.textureCount = 1;
        var a, c = this.gl;
        for (var d in this.uniforms)
            a = this.uniforms[d],
            1 === a.glValueLength ? a.glMatrix === !0 ? a.glFunc.call(c, a.uniformLocation, a.transpose, a.value) : a.glFunc.call(c, a.uniformLocation, a.value) : 2 === a.glValueLength ? a.glFunc.call(c, a.uniformLocation, a.value.x, a.value.y) : 3 === a.glValueLength ? a.glFunc.call(c, a.uniformLocation, a.value.x, a.value.y, a.value.z) : 4 === a.glValueLength ? a.glFunc.call(c, a.uniformLocation, a.value.x, a.value.y, a.value.z, a.value.w) : "sampler2D" === a.type && (a._init ? (c.activeTexture(c["TEXTURE" + this.textureCount]),
            a.value.baseTexture._dirty[c.id] ? b.instances[c.id].updateTexture(a.value.baseTexture) : c.bindTexture(c.TEXTURE_2D, a.value.baseTexture._glTextures[c.id]),
            c.uniform1i(a.uniformLocation, this.textureCount),
            this.textureCount++) : this.initSampler2D(a))
    }
    ,
    b.PixiShader.prototype.destroy = function() {
        this.gl.deleteProgram(this.program),
        this.uniforms = null,
        this.gl = null,
        this.attributes = null
    }
    ,
    b.PixiShader.defaultVertexSrc = ["attribute vec2 aVertexPosition;", "attribute vec2 aTextureCoord;", "attribute vec4 aColor;", "uniform vec2 projectionVector;", "uniform vec2 offsetVector;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "const vec2 center = vec2(-1.0, 1.0);", "void main(void) {", "   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);", "   vTextureCoord = aTextureCoord;", "   vColor = vec4(aColor.rgb * aColor.a, aColor.a);", "}"],
    b.PixiFastShader = function(a) {
        this._UID = b._UID++,
        this.gl = a,
        this.program = null,
        this.fragmentSrc = ["precision lowp float;", "varying vec2 vTextureCoord;", "varying float vColor;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;", "}"],
        this.vertexSrc = ["attribute vec2 aVertexPosition;", "attribute vec2 aPositionCoord;", "attribute vec2 aScale;", "attribute float aRotation;", "attribute vec2 aTextureCoord;", "attribute float aColor;", "uniform vec2 projectionVector;", "uniform vec2 offsetVector;", "uniform mat3 uMatrix;", "varying vec2 vTextureCoord;", "varying float vColor;", "const vec2 center = vec2(-1.0, 1.0);", "void main(void) {", "   vec2 v;", "   vec2 sv = aVertexPosition * aScale;", "   v.x = (sv.x) * cos(aRotation) - (sv.y) * sin(aRotation);", "   v.y = (sv.x) * sin(aRotation) + (sv.y) * cos(aRotation);", "   v = ( uMatrix * vec3(v + aPositionCoord , 1.0) ).xy ;", "   gl_Position = vec4( ( v / projectionVector) + center , 0.0, 1.0);", "   vTextureCoord = aTextureCoord;", "   vColor = aColor;", "}"],
        this.textureCount = 0,
        this.init()
    }
    ,
    b.PixiFastShader.prototype.constructor = b.PixiFastShader,
    b.PixiFastShader.prototype.init = function() {
        var a = this.gl
          , c = b.compileProgram(a, this.vertexSrc, this.fragmentSrc);
        a.useProgram(c),
        this.uSampler = a.getUniformLocation(c, "uSampler"),
        this.projectionVector = a.getUniformLocation(c, "projectionVector"),
        this.offsetVector = a.getUniformLocation(c, "offsetVector"),
        this.dimensions = a.getUniformLocation(c, "dimensions"),
        this.uMatrix = a.getUniformLocation(c, "uMatrix"),
        this.aVertexPosition = a.getAttribLocation(c, "aVertexPosition"),
        this.aPositionCoord = a.getAttribLocation(c, "aPositionCoord"),
        this.aScale = a.getAttribLocation(c, "aScale"),
        this.aRotation = a.getAttribLocation(c, "aRotation"),
        this.aTextureCoord = a.getAttribLocation(c, "aTextureCoord"),
        this.colorAttribute = a.getAttribLocation(c, "aColor"),
        -1 === this.colorAttribute && (this.colorAttribute = 2),
        this.attributes = [this.aVertexPosition, this.aPositionCoord, this.aScale, this.aRotation, this.aTextureCoord, this.colorAttribute],
        this.program = c
    }
    ,
    b.PixiFastShader.prototype.destroy = function() {
        this.gl.deleteProgram(this.program),
        this.uniforms = null,
        this.gl = null,
        this.attributes = null
    }
    ,
    b.StripShader = function(a) {
        this._UID = b._UID++,
        this.gl = a,
        this.program = null,
        this.fragmentSrc = ["precision mediump float;", "varying vec2 vTextureCoord;", "uniform float alpha;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * alpha;", "}"],
        this.vertexSrc = ["attribute vec2 aVertexPosition;", "attribute vec2 aTextureCoord;", "uniform mat3 translationMatrix;", "uniform vec2 projectionVector;", "uniform vec2 offsetVector;", "varying vec2 vTextureCoord;", "void main(void) {", "   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);", "   v -= offsetVector.xyx;", "   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);", "   vTextureCoord = aTextureCoord;", "}"],
        this.init()
    }
    ,
    b.StripShader.prototype.constructor = b.StripShader,
    b.StripShader.prototype.init = function() {
        var a = this.gl
          , c = b.compileProgram(a, this.vertexSrc, this.fragmentSrc);
        a.useProgram(c),
        this.uSampler = a.getUniformLocation(c, "uSampler"),
        this.projectionVector = a.getUniformLocation(c, "projectionVector"),
        this.offsetVector = a.getUniformLocation(c, "offsetVector"),
        this.colorAttribute = a.getAttribLocation(c, "aColor"),
        this.aVertexPosition = a.getAttribLocation(c, "aVertexPosition"),
        this.aTextureCoord = a.getAttribLocation(c, "aTextureCoord"),
        this.attributes = [this.aVertexPosition, this.aTextureCoord],
        this.translationMatrix = a.getUniformLocation(c, "translationMatrix"),
        this.alpha = a.getUniformLocation(c, "alpha"),
        this.program = c
    }
    ,
    b.StripShader.prototype.destroy = function() {
        this.gl.deleteProgram(this.program),
        this.uniforms = null,
        this.gl = null,
        this.attribute = null
    }
    ,
    b.PrimitiveShader = function(a) {
        this._UID = b._UID++,
        this.gl = a,
        this.program = null,
        this.fragmentSrc = ["precision mediump float;", "varying vec4 vColor;", "void main(void) {", "   gl_FragColor = vColor;", "}"],
        this.vertexSrc = ["attribute vec2 aVertexPosition;", "attribute vec4 aColor;", "uniform mat3 translationMatrix;", "uniform vec2 projectionVector;", "uniform vec2 offsetVector;", "uniform float alpha;", "uniform float flipY;", "uniform vec3 tint;", "varying vec4 vColor;", "void main(void) {", "   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);", "   v -= offsetVector.xyx;", "   gl_Position = vec4( v.x / projectionVector.x -1.0, (v.y / projectionVector.y * -flipY) + flipY , 0.0, 1.0);", "   vColor = aColor * vec4(tint * alpha, alpha);", "}"],
        this.init()
    }
    ,
    b.PrimitiveShader.prototype.constructor = b.PrimitiveShader,
    b.PrimitiveShader.prototype.init = function() {
        var a = this.gl
          , c = b.compileProgram(a, this.vertexSrc, this.fragmentSrc);
        a.useProgram(c),
        this.projectionVector = a.getUniformLocation(c, "projectionVector"),
        this.offsetVector = a.getUniformLocation(c, "offsetVector"),
        this.tintColor = a.getUniformLocation(c, "tint"),
        this.flipY = a.getUniformLocation(c, "flipY"),
        this.aVertexPosition = a.getAttribLocation(c, "aVertexPosition"),
        this.colorAttribute = a.getAttribLocation(c, "aColor"),
        this.attributes = [this.aVertexPosition, this.colorAttribute],
        this.translationMatrix = a.getUniformLocation(c, "translationMatrix"),
        this.alpha = a.getUniformLocation(c, "alpha"),
        this.program = c
    }
    ,
    b.PrimitiveShader.prototype.destroy = function() {
        this.gl.deleteProgram(this.program),
        this.uniforms = null,
        this.gl = null,
        this.attributes = null
    }
    ,
    b.ComplexPrimitiveShader = function(a) {
        this._UID = b._UID++,
        this.gl = a,
        this.program = null,
        this.fragmentSrc = ["precision mediump float;", "varying vec4 vColor;", "void main(void) {", "   gl_FragColor = vColor;", "}"],
        this.vertexSrc = ["attribute vec2 aVertexPosition;", "uniform mat3 translationMatrix;", "uniform vec2 projectionVector;", "uniform vec2 offsetVector;", "uniform vec3 tint;", "uniform float alpha;", "uniform vec3 color;", "uniform float flipY;", "varying vec4 vColor;", "void main(void) {", "   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);", "   v -= offsetVector.xyx;", "   gl_Position = vec4( v.x / projectionVector.x -1.0, (v.y / projectionVector.y * -flipY) + flipY , 0.0, 1.0);", "   vColor = vec4(color * alpha * tint, alpha);", "}"],
        this.init()
    }
    ,
    b.ComplexPrimitiveShader.prototype.constructor = b.ComplexPrimitiveShader,
    b.ComplexPrimitiveShader.prototype.init = function() {
        var a = this.gl
          , c = b.compileProgram(a, this.vertexSrc, this.fragmentSrc);
        a.useProgram(c),
        this.projectionVector = a.getUniformLocation(c, "projectionVector"),
        this.offsetVector = a.getUniformLocation(c, "offsetVector"),
        this.tintColor = a.getUniformLocation(c, "tint"),
        this.color = a.getUniformLocation(c, "color"),
        this.flipY = a.getUniformLocation(c, "flipY"),
        this.aVertexPosition = a.getAttribLocation(c, "aVertexPosition"),
        this.attributes = [this.aVertexPosition, this.colorAttribute],
        this.translationMatrix = a.getUniformLocation(c, "translationMatrix"),
        this.alpha = a.getUniformLocation(c, "alpha"),
        this.program = c
    }
    ,
    b.ComplexPrimitiveShader.prototype.destroy = function() {
        this.gl.deleteProgram(this.program),
        this.uniforms = null,
        this.gl = null,
        this.attribute = null
    }
    ,
    b.WebGLGraphics = function() {}
    ,
    b.WebGLGraphics.renderGraphics = function(a, c) {
        var d, e = c.gl, f = c.projection, g = c.offset, h = c.shaderManager.primitiveShader;
        a.dirty && b.WebGLGraphics.updateGraphics(a, e);
        for (var i = a._webGL[e.id], j = 0; j < i.data.length; j++)
            1 === i.data[j].mode ? (d = i.data[j],
            c.stencilManager.pushStencil(a, d, c),
            e.drawElements(e.TRIANGLE_FAN, 4, e.UNSIGNED_SHORT, 2 * (d.indices.length - 4)),
            c.stencilManager.popStencil(a, d, c)) : (d = i.data[j],
            c.shaderManager.setShader(h),
            h = c.shaderManager.primitiveShader,
            e.uniformMatrix3fv(h.translationMatrix, !1, a.worldTransform.toArray(!0)),
            e.uniform1f(h.flipY, 1),
            e.uniform2f(h.projectionVector, f.x, -f.y),
            e.uniform2f(h.offsetVector, -g.x, -g.y),
            e.uniform3fv(h.tintColor, b.hex2rgb(a.tint)),
            e.uniform1f(h.alpha, a.worldAlpha),
            e.bindBuffer(e.ARRAY_BUFFER, d.buffer),
            e.vertexAttribPointer(h.aVertexPosition, 2, e.FLOAT, !1, 24, 0),
            e.vertexAttribPointer(h.colorAttribute, 4, e.FLOAT, !1, 24, 8),
            e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, d.indexBuffer),
            e.drawElements(e.TRIANGLE_STRIP, d.indices.length, e.UNSIGNED_SHORT, 0))
    }
    ,
    b.WebGLGraphics.updateGraphics = function(a, c) {
        var d = a._webGL[c.id];
        d || (d = a._webGL[c.id] = {
            lastIndex: 0,
            data: [],
            gl: c
        }),
        a.dirty = !1;
        var e;
        if (a.clearDirty) {
            for (a.clearDirty = !1,
            e = 0; e < d.data.length; e++) {
                var f = d.data[e];
                f.reset(),
                b.WebGLGraphics.graphicsDataPool.push(f)
            }
            d.data = [],
            d.lastIndex = 0
        }
        var g;
        for (e = d.lastIndex; e < a.graphicsData.length; e++) {
            var h = a.graphicsData[e];
            if (h.type === b.Graphics.POLY) {
                if (h.points = h.shape.points.slice(),
                h.shape.closed && (h.points[0] !== h.points[h.points.length - 2] || h.points[1] !== h.points[h.points.length - 1]) && h.points.push(h.points[0], h.points[1]),
                h.fill && h.points.length >= 6)
                    if (h.points.length < 12) {
                        g = b.WebGLGraphics.switchMode(d, 0);
                        var i = b.WebGLGraphics.buildPoly(h, g);
                        i || (g = b.WebGLGraphics.switchMode(d, 1),
                        b.WebGLGraphics.buildComplexPoly(h, g))
                    } else
                        g = b.WebGLGraphics.switchMode(d, 1),
                        b.WebGLGraphics.buildComplexPoly(h, g);
                h.lineWidth > 0 && (g = b.WebGLGraphics.switchMode(d, 0),
                b.WebGLGraphics.buildLine(h, g))
            } else
                g = b.WebGLGraphics.switchMode(d, 0),
                h.type === b.Graphics.RECT ? b.WebGLGraphics.buildRectangle(h, g) : h.type === b.Graphics.CIRC || h.type === b.Graphics.ELIP ? b.WebGLGraphics.buildCircle(h, g) : h.type === b.Graphics.RREC && b.WebGLGraphics.buildRoundedRectangle(h, g);
            d.lastIndex++
        }
        for (e = 0; e < d.data.length; e++)
            g = d.data[e],
            g.dirty && g.upload()
    }
    ,
    b.WebGLGraphics.switchMode = function(a, c) {
        var d;
        return a.data.length ? (d = a.data[a.data.length - 1],
        (d.mode !== c || 1 === c) && (d = b.WebGLGraphics.graphicsDataPool.pop() || new b.WebGLGraphicsData(a.gl),
        d.mode = c,
        a.data.push(d))) : (d = b.WebGLGraphics.graphicsDataPool.pop() || new b.WebGLGraphicsData(a.gl),
        d.mode = c,
        a.data.push(d)),
        d.dirty = !0,
        d
    }
    ,
    b.WebGLGraphics.buildRectangle = function(a, c) {
        var d = a.shape
          , e = d.x
          , f = d.y
          , g = d.width
          , h = d.height;
        if (a.fill) {
            var i = b.hex2rgb(a.fillColor)
              , j = a.fillAlpha
              , k = i[0] * j
              , l = i[1] * j
              , m = i[2] * j
              , n = c.points
              , o = c.indices
              , p = n.length / 6;
            n.push(e, f),
            n.push(k, l, m, j),
            n.push(e + g, f),
            n.push(k, l, m, j),
            n.push(e, f + h),
            n.push(k, l, m, j),
            n.push(e + g, f + h),
            n.push(k, l, m, j),
            o.push(p, p, p + 1, p + 2, p + 3, p + 3)
        }
        if (a.lineWidth) {
            var q = a.points;
            a.points = [e, f, e + g, f, e + g, f + h, e, f + h, e, f],
            b.WebGLGraphics.buildLine(a, c),
            a.points = q
        }
    }
    ,
    b.WebGLGraphics.buildRoundedRectangle = function(a, c) {
        var d = a.shape
          , e = d.x
          , f = d.y
          , g = d.width
          , h = d.height
          , i = d.radius
          , j = [];
        if (j.push(e, f + i),
        j = j.concat(b.WebGLGraphics.quadraticBezierCurve(e, f + h - i, e, f + h, e + i, f + h)),
        j = j.concat(b.WebGLGraphics.quadraticBezierCurve(e + g - i, f + h, e + g, f + h, e + g, f + h - i)),
        j = j.concat(b.WebGLGraphics.quadraticBezierCurve(e + g, f + i, e + g, f, e + g - i, f)),
        j = j.concat(b.WebGLGraphics.quadraticBezierCurve(e + i, f, e, f, e, f + i)),
        a.fill) {
            var k = b.hex2rgb(a.fillColor)
              , l = a.fillAlpha
              , m = k[0] * l
              , n = k[1] * l
              , o = k[2] * l
              , p = c.points
              , q = c.indices
              , r = p.length / 6
              , s = b.PolyK.Triangulate(j)
              , t = 0;
            for (t = 0; t < s.length; t += 3)
                q.push(s[t] + r),
                q.push(s[t] + r),
                q.push(s[t + 1] + r),
                q.push(s[t + 2] + r),
                q.push(s[t + 2] + r);
            for (t = 0; t < j.length; t++)
                p.push(j[t], j[++t], m, n, o, l)
        }
        if (a.lineWidth) {
            var u = a.points;
            a.points = j,
            b.WebGLGraphics.buildLine(a, c),
            a.points = u
        }
    }
    ,
    b.WebGLGraphics.quadraticBezierCurve = function(a, b, c, d, e, f) {
        function g(a, b, c) {
            var d = b - a;
            return a + d * c
        }
        for (var h, i, j, k, l, m, n = 20, o = [], p = 0, q = 0; n >= q; q++)
            p = q / n,
            h = g(a, c, p),
            i = g(b, d, p),
            j = g(c, e, p),
            k = g(d, f, p),
            l = g(h, j, p),
            m = g(i, k, p),
            o.push(l, m);
        return o
    }
    ,
    b.WebGLGraphics.buildCircle = function(a, c) {
        var d, e, f = a.shape, g = f.x, h = f.y;
        a.type === b.Graphics.CIRC ? (d = f.radius,
        e = f.radius) : (d = f.width,
        e = f.height);
        var i = 40
          , j = 2 * Math.PI / i
          , k = 0;
        if (a.fill) {
            var l = b.hex2rgb(a.fillColor)
              , m = a.fillAlpha
              , n = l[0] * m
              , o = l[1] * m
              , p = l[2] * m
              , q = c.points
              , r = c.indices
              , s = q.length / 6;
            for (r.push(s),
            k = 0; i + 1 > k; k++)
                q.push(g, h, n, o, p, m),
                q.push(g + Math.sin(j * k) * d, h + Math.cos(j * k) * e, n, o, p, m),
                r.push(s++, s++);
            r.push(s - 1)
        }
        if (a.lineWidth) {
            var t = a.points;
            for (a.points = [],
            k = 0; i + 1 > k; k++)
                a.points.push(g + Math.sin(j * k) * d, h + Math.cos(j * k) * e);
            b.WebGLGraphics.buildLine(a, c),
            a.points = t
        }
    }
    ,
    b.WebGLGraphics.buildLine = function(a, c) {
        var d = 0
          , e = a.points;
        if (0 !== e.length) {
            if (a.lineWidth % 2)
                for (d = 0; d < e.length; d++)
                    e[d] += .5;
            var f = new b.Point(e[0],e[1])
              , g = new b.Point(e[e.length - 2],e[e.length - 1]);
            if (f.x === g.x && f.y === g.y) {
                e = e.slice(),
                e.pop(),
                e.pop(),
                g = new b.Point(e[e.length - 2],e[e.length - 1]);
                var h = g.x + .5 * (f.x - g.x)
                  , i = g.y + .5 * (f.y - g.y);
                e.unshift(h, i),
                e.push(h, i)
            }
            var j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G = c.points, H = c.indices, I = e.length / 2, J = e.length, K = G.length / 6, L = a.lineWidth / 2, M = b.hex2rgb(a.lineColor), N = a.lineAlpha, O = M[0] * N, P = M[1] * N, Q = M[2] * N;
            for (l = e[0],
            m = e[1],
            n = e[2],
            o = e[3],
            r = -(m - o),
            s = l - n,
            F = Math.sqrt(r * r + s * s),
            r /= F,
            s /= F,
            r *= L,
            s *= L,
            G.push(l - r, m - s, O, P, Q, N),
            G.push(l + r, m + s, O, P, Q, N),
            d = 1; I - 1 > d; d++)
                l = e[2 * (d - 1)],
                m = e[2 * (d - 1) + 1],
                n = e[2 * d],
                o = e[2 * d + 1],
                p = e[2 * (d + 1)],
                q = e[2 * (d + 1) + 1],
                r = -(m - o),
                s = l - n,
                F = Math.sqrt(r * r + s * s),
                r /= F,
                s /= F,
                r *= L,
                s *= L,
                t = -(o - q),
                u = n - p,
                F = Math.sqrt(t * t + u * u),
                t /= F,
                u /= F,
                t *= L,
                u *= L,
                x = -s + m - (-s + o),
                y = -r + n - (-r + l),
                z = (-r + l) * (-s + o) - (-r + n) * (-s + m),
                A = -u + q - (-u + o),
                B = -t + n - (-t + p),
                C = (-t + p) * (-u + o) - (-t + n) * (-u + q),
                D = x * B - A * y,
                Math.abs(D) < .1 ? (D += 10.1,
                G.push(n - r, o - s, O, P, Q, N),
                G.push(n + r, o + s, O, P, Q, N)) : (j = (y * C - B * z) / D,
                k = (A * z - x * C) / D,
                E = (j - n) * (j - n) + (k - o) + (k - o),
                E > 19600 ? (v = r - t,
                w = s - u,
                F = Math.sqrt(v * v + w * w),
                v /= F,
                w /= F,
                v *= L,
                w *= L,
                G.push(n - v, o - w),
                G.push(O, P, Q, N),
                G.push(n + v, o + w),
                G.push(O, P, Q, N),
                G.push(n - v, o - w),
                G.push(O, P, Q, N),
                J++) : (G.push(j, k),
                G.push(O, P, Q, N),
                G.push(n - (j - n), o - (k - o)),
                G.push(O, P, Q, N)));
            for (l = e[2 * (I - 2)],
            m = e[2 * (I - 2) + 1],
            n = e[2 * (I - 1)],
            o = e[2 * (I - 1) + 1],
            r = -(m - o),
            s = l - n,
            F = Math.sqrt(r * r + s * s),
            r /= F,
            s /= F,
            r *= L,
            s *= L,
            G.push(n - r, o - s),
            G.push(O, P, Q, N),
            G.push(n + r, o + s),
            G.push(O, P, Q, N),
            H.push(K),
            d = 0; J > d; d++)
                H.push(K++);
            H.push(K - 1)
        }
    }
    ,
    b.WebGLGraphics.buildComplexPoly = function(a, c) {
        var d = a.points.slice();
        if (!(d.length < 6)) {
            var e = c.indices;
            c.points = d,
            c.alpha = a.fillAlpha,
            c.color = b.hex2rgb(a.fillColor);
            for (var f, g, h = 1 / 0, i = -1 / 0, j = 1 / 0, k = -1 / 0, l = 0; l < d.length; l += 2)
                f = d[l],
                g = d[l + 1],
                h = h > f ? f : h,
                i = f > i ? f : i,
                j = j > g ? g : j,
                k = g > k ? g : k;
            d.push(h, j, i, j, i, k, h, k);
            var m = d.length / 2;
            for (l = 0; m > l; l++)
                e.push(l)
        }
    }
    ,
    b.WebGLGraphics.buildPoly = function(a, c) {
        var d = a.points;
        if (!(d.length < 6)) {
            var e = c.points
              , f = c.indices
              , g = d.length / 2
              , h = b.hex2rgb(a.fillColor)
              , i = a.fillAlpha
              , j = h[0] * i
              , k = h[1] * i
              , l = h[2] * i
              , m = b.PolyK.Triangulate(d);
            if (!m)
                return !1;
            var n = e.length / 6
              , o = 0;
            for (o = 0; o < m.length; o += 3)
                f.push(m[o] + n),
                f.push(m[o] + n),
                f.push(m[o + 1] + n),
                f.push(m[o + 2] + n),
                f.push(m[o + 2] + n);
            for (o = 0; g > o; o++)
                e.push(d[2 * o], d[2 * o + 1], j, k, l, i);
            return !0
        }
    }
    ,
    b.WebGLGraphics.graphicsDataPool = [],
    b.WebGLGraphicsData = function(a) {
        this.gl = a,
        this.color = [0, 0, 0],
        this.points = [],
        this.indices = [],
        this.buffer = a.createBuffer(),
        this.indexBuffer = a.createBuffer(),
        this.mode = 1,
        this.alpha = 1,
        this.dirty = !0
    }
    ,
    b.WebGLGraphicsData.prototype.reset = function() {
        this.points = [],
        this.indices = []
    }
    ,
    b.WebGLGraphicsData.prototype.upload = function() {
        var a = this.gl;
        this.glPoints = new b.Float32Array(this.points),
        a.bindBuffer(a.ARRAY_BUFFER, this.buffer),
        a.bufferData(a.ARRAY_BUFFER, this.glPoints, a.STATIC_DRAW),
        this.glIndicies = new b.Uint16Array(this.indices),
        a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.indexBuffer),
        a.bufferData(a.ELEMENT_ARRAY_BUFFER, this.glIndicies, a.STATIC_DRAW),
        this.dirty = !1
    }
    ,
    b.glContexts = [],
    b.instances = [],
    b.WebGLRenderer = function(a, c, d) {
        if (d)
            for (var e in b.defaultRenderOptions)
                void 0 === d[e] && (d[e] = b.defaultRenderOptions[e]);
        else
            d = b.defaultRenderOptions;
        b.defaultRenderer || (b.defaultRenderer = this),
        this.type = b.WEBGL_RENDERER,
        this.resolution = d.resolution,
        this.transparent = d.transparent,
        this.autoResize = d.autoResize || !1,
        this.preserveDrawingBuffer = d.preserveDrawingBuffer,
        this.clearBeforeRender = d.clearBeforeRender,
        this.width = a || 800,
        this.height = c || 600,
        this.view = d.view || document.createElement("canvas"),
        this._contextOptions = {
            alpha: this.transparent,
            antialias: d.antialias,
            premultipliedAlpha: this.transparent && "notMultiplied" !== this.transparent,
            stencil: !0,
            preserveDrawingBuffer: d.preserveDrawingBuffer
        },
        this.projection = new b.Point,
        this.offset = new b.Point(0,0),
        this.shaderManager = new b.WebGLShaderManager,
        this.spriteBatch = new b.WebGLSpriteBatch,
        this.maskManager = new b.WebGLMaskManager,
        this.filterManager = new b.WebGLFilterManager,
        this.stencilManager = new b.WebGLStencilManager,
        this.blendModeManager = new b.WebGLBlendModeManager,
        this.renderSession = {},
        this.renderSession.gl = this.gl,
        this.renderSession.drawCount = 0,
        this.renderSession.shaderManager = this.shaderManager,
        this.renderSession.maskManager = this.maskManager,
        this.renderSession.filterManager = this.filterManager,
        this.renderSession.blendModeManager = this.blendModeManager,
        this.renderSession.spriteBatch = this.spriteBatch,
        this.renderSession.stencilManager = this.stencilManager,
        this.renderSession.renderer = this,
        this.renderSession.resolution = this.resolution,
        this.initContext(),
        this.mapBlendModes()
    }
    ,
    b.WebGLRenderer.prototype.constructor = b.WebGLRenderer,
    b.WebGLRenderer.prototype.initContext = function() {
        var a = this.view.getContext("webgl", this._contextOptions) || this.view.getContext("experimental-webgl", this._contextOptions);
        if (this.gl = a,
        !a)
            throw new Error("This browser does not support webGL. Try using the canvas renderer");
        this.glContextId = a.id = b.WebGLRenderer.glContextId++,
        b.glContexts[this.glContextId] = a,
        b.instances[this.glContextId] = this,
        a.disable(a.DEPTH_TEST),
        a.disable(a.CULL_FACE),
        a.enable(a.BLEND),
        this.shaderManager.setContext(a),
        this.spriteBatch.setContext(a),
        this.maskManager.setContext(a),
        this.filterManager.setContext(a),
        this.blendModeManager.setContext(a),
        this.stencilManager.setContext(a),
        this.renderSession.gl = this.gl,
        this.resize(this.width, this.height)
    }
    ,
    b.WebGLRenderer.prototype.render = function(a) {
        if (!this.contextLost) {
            this.__stage !== a && (this.__stage = a),
            a.updateTransform();
            var b = this.gl;
            b.viewport(0, 0, this.width, this.height),
            b.bindFramebuffer(b.FRAMEBUFFER, null),
            this.clearBeforeRender && (this.transparent ? b.clearColor(0, 0, 0, 0) : b.clearColor(a.backgroundColorSplit[0], a.backgroundColorSplit[1], a.backgroundColorSplit[2], 1),
            b.clear(b.COLOR_BUFFER_BIT)),
            this.renderDisplayObject(a, this.projection)
        }
    }
    ,
    b.WebGLRenderer.prototype.renderDisplayObject = function(a, c, d, e) {
        this.renderSession.blendModeManager.setBlendMode(b.blendModes.NORMAL),
        this.renderSession.drawCount = 0,
        this.renderSession.flipY = d ? -1 : 1,
        this.renderSession.projection = c,
        this.renderSession.offset = this.offset,
        this.spriteBatch.begin(this.renderSession),
        this.filterManager.begin(this.renderSession, d),
        a._renderWebGL(this.renderSession, e),
        this.spriteBatch.end()
    }
    ,
    b.WebGLRenderer.prototype.resize = function(a, b) {
        this.width = a * this.resolution,
        this.height = b * this.resolution,
        this.view.width = this.width,
        this.view.height = this.height,
        this.autoResize && (this.view.style.width = this.width / this.resolution + "px",
        this.view.style.height = this.height / this.resolution + "px"),
        this.gl.viewport(0, 0, this.width, this.height),
        this.projection.x = this.width / 2 / this.resolution,
        this.projection.y = -this.height / 2 / this.resolution
    }
    ,
    b.WebGLRenderer.prototype.updateTexture = function(a) {
        if (a.hasLoaded) {
            var c = this.gl;
            return a._glTextures[c.id] || (a._glTextures[c.id] = c.createTexture()),
            c.bindTexture(c.TEXTURE_2D, a._glTextures[c.id]),
            c.pixelStorei(c.UNPACK_PREMULTIPLY_ALPHA_WEBGL, a.premultipliedAlpha),
            c.texImage2D(c.TEXTURE_2D, 0, c.RGBA, c.RGBA, c.UNSIGNED_BYTE, a.source),
            c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, a.scaleMode === b.scaleModes.LINEAR ? c.LINEAR : c.NEAREST),
            a.mipmap && b.isPowerOfTwo(a.width, a.height) ? (c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, a.scaleMode === b.scaleModes.LINEAR ? c.LINEAR_MIPMAP_LINEAR : c.NEAREST_MIPMAP_NEAREST),
            c.generateMipmap(c.TEXTURE_2D)) : c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, a.scaleMode === b.scaleModes.LINEAR ? c.LINEAR : c.NEAREST),
            a._powerOf2 ? (c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.REPEAT),
            c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.REPEAT)) : (c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.CLAMP_TO_EDGE),
            c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.CLAMP_TO_EDGE)),
            a._dirty[c.id] = !1,
            a._glTextures[c.id]
        }
    }
    ,
    b.WebGLRenderer.prototype.destroy = function() {
        b.glContexts[this.glContextId] = null,
        this.projection = null,
        this.offset = null,
        this.shaderManager.destroy(),
        this.spriteBatch.destroy(),
        this.maskManager.destroy(),
        this.filterManager.destroy(),
        this.shaderManager = null,
        this.spriteBatch = null,
        this.maskManager = null,
        this.filterManager = null,
        this.gl = null,
        this.renderSession = null,
        b.CanvasPool.remove(this),
        b.instances[this.glContextId] = null,
        b.WebGLRenderer.glContextId--
    }
    ,
    b.WebGLRenderer.prototype.mapBlendModes = function() {
        var a = this.gl;
        b.blendModesWebGL || (b.blendModesWebGL = [],
        b.blendModesWebGL[b.blendModes.NORMAL] = [a.ONE, a.ONE_MINUS_SRC_ALPHA],
        b.blendModesWebGL[b.blendModes.ADD] = [a.SRC_ALPHA, a.DST_ALPHA],
        b.blendModesWebGL[b.blendModes.MULTIPLY] = [a.DST_COLOR, a.ONE_MINUS_SRC_ALPHA],
        b.blendModesWebGL[b.blendModes.SCREEN] = [a.SRC_ALPHA, a.ONE],
        b.blendModesWebGL[b.blendModes.OVERLAY] = [a.ONE, a.ONE_MINUS_SRC_ALPHA],
        b.blendModesWebGL[b.blendModes.DARKEN] = [a.ONE, a.ONE_MINUS_SRC_ALPHA],
        b.blendModesWebGL[b.blendModes.LIGHTEN] = [a.ONE, a.ONE_MINUS_SRC_ALPHA],
        b.blendModesWebGL[b.blendModes.COLOR_DODGE] = [a.ONE, a.ONE_MINUS_SRC_ALPHA],
        b.blendModesWebGL[b.blendModes.COLOR_BURN] = [a.ONE, a.ONE_MINUS_SRC_ALPHA],
        b.blendModesWebGL[b.blendModes.HARD_LIGHT] = [a.ONE, a.ONE_MINUS_SRC_ALPHA],
        b.blendModesWebGL[b.blendModes.SOFT_LIGHT] = [a.ONE, a.ONE_MINUS_SRC_ALPHA],
        b.blendModesWebGL[b.blendModes.DIFFERENCE] = [a.ONE, a.ONE_MINUS_SRC_ALPHA],
        b.blendModesWebGL[b.blendModes.EXCLUSION] = [a.ONE, a.ONE_MINUS_SRC_ALPHA],
        b.blendModesWebGL[b.blendModes.HUE] = [a.ONE, a.ONE_MINUS_SRC_ALPHA],
        b.blendModesWebGL[b.blendModes.SATURATION] = [a.ONE, a.ONE_MINUS_SRC_ALPHA],
        b.blendModesWebGL[b.blendModes.COLOR] = [a.ONE, a.ONE_MINUS_SRC_ALPHA],
        b.blendModesWebGL[b.blendModes.LUMINOSITY] = [a.ONE, a.ONE_MINUS_SRC_ALPHA])
    }
    ,
    b.WebGLRenderer.glContextId = 0,
    b.WebGLBlendModeManager = function() {
        this.currentBlendMode = 99999
    }
    ,
    b.WebGLBlendModeManager.prototype.constructor = b.WebGLBlendModeManager,
    b.WebGLBlendModeManager.prototype.setContext = function(a) {
        this.gl = a
    }
    ,
    b.WebGLBlendModeManager.prototype.setBlendMode = function(a) {
        if (this.currentBlendMode === a)
            return !1;
        this.currentBlendMode = a;
        var c = b.blendModesWebGL[this.currentBlendMode];
        return this.gl.blendFunc(c[0], c[1]),
        !0
    }
    ,
    b.WebGLBlendModeManager.prototype.destroy = function() {
        this.gl = null
    }
    ,
    b.WebGLMaskManager = function() {}
    ,
    b.WebGLMaskManager.prototype.constructor = b.WebGLMaskManager,
    b.WebGLMaskManager.prototype.setContext = function(a) {
        this.gl = a
    }
    ,
    b.WebGLMaskManager.prototype.pushMask = function(a, c) {
        var d = c.gl;
        a.dirty && b.WebGLGraphics.updateGraphics(a, d),
        a._webGL[d.id].data.length && c.stencilManager.pushStencil(a, a._webGL[d.id].data[0], c)
    }
    ,
    b.WebGLMaskManager.prototype.popMask = function(a, b) {
        var c = this.gl;
        b.stencilManager.popStencil(a, a._webGL[c.id].data[0], b)
    }
    ,
    b.WebGLMaskManager.prototype.destroy = function() {
        this.gl = null
    }
    ,
    b.WebGLStencilManager = function() {
        this.stencilStack = [],
        this.reverse = !0,
        this.count = 0
    }
    ,
    b.WebGLStencilManager.prototype.setContext = function(a) {
        this.gl = a
    }
    ,
    b.WebGLStencilManager.prototype.pushStencil = function(a, b, c) {
        var d = this.gl;
        this.bindGraphics(a, b, c),
        0 === this.stencilStack.length && (d.enable(d.STENCIL_TEST),
        d.clear(d.STENCIL_BUFFER_BIT),
        this.reverse = !0,
        this.count = 0),
        this.stencilStack.push(b);
        var e = this.count;
        d.colorMask(!1, !1, !1, !1),
        d.stencilFunc(d.ALWAYS, 0, 255),
        d.stencilOp(d.KEEP, d.KEEP, d.INVERT),
        1 === b.mode ? (d.drawElements(d.TRIANGLE_FAN, b.indices.length - 4, d.UNSIGNED_SHORT, 0),
        this.reverse ? (d.stencilFunc(d.EQUAL, 255 - e, 255),
        d.stencilOp(d.KEEP, d.KEEP, d.DECR)) : (d.stencilFunc(d.EQUAL, e, 255),
        d.stencilOp(d.KEEP, d.KEEP, d.INCR)),
        d.drawElements(d.TRIANGLE_FAN, 4, d.UNSIGNED_SHORT, 2 * (b.indices.length - 4)),
        this.reverse ? d.stencilFunc(d.EQUAL, 255 - (e + 1), 255) : d.stencilFunc(d.EQUAL, e + 1, 255),
        this.reverse = !this.reverse) : (this.reverse ? (d.stencilFunc(d.EQUAL, e, 255),
        d.stencilOp(d.KEEP, d.KEEP, d.INCR)) : (d.stencilFunc(d.EQUAL, 255 - e, 255),
        d.stencilOp(d.KEEP, d.KEEP, d.DECR)),
        d.drawElements(d.TRIANGLE_STRIP, b.indices.length, d.UNSIGNED_SHORT, 0),
        this.reverse ? d.stencilFunc(d.EQUAL, e + 1, 255) : d.stencilFunc(d.EQUAL, 255 - (e + 1), 255)),
        d.colorMask(!0, !0, !0, !0),
        d.stencilOp(d.KEEP, d.KEEP, d.KEEP),
        this.count++
    }
    ,
    b.WebGLStencilManager.prototype.bindGraphics = function(a, c, d) {
        this._currentGraphics = a;
        var e, f = this.gl, g = d.projection, h = d.offset;
        1 === c.mode ? (e = d.shaderManager.complexPrimitiveShader,
        d.shaderManager.setShader(e),
        f.uniform1f(e.flipY, d.flipY),
        f.uniformMatrix3fv(e.translationMatrix, !1, a.worldTransform.toArray(!0)),
        f.uniform2f(e.projectionVector, g.x, -g.y),
        f.uniform2f(e.offsetVector, -h.x, -h.y),
        f.uniform3fv(e.tintColor, b.hex2rgb(a.tint)),
        f.uniform3fv(e.color, c.color),
        f.uniform1f(e.alpha, a.worldAlpha * c.alpha),
        f.bindBuffer(f.ARRAY_BUFFER, c.buffer),
        f.vertexAttribPointer(e.aVertexPosition, 2, f.FLOAT, !1, 8, 0),
        f.bindBuffer(f.ELEMENT_ARRAY_BUFFER, c.indexBuffer)) : (e = d.shaderManager.primitiveShader,
        d.shaderManager.setShader(e),
        f.uniformMatrix3fv(e.translationMatrix, !1, a.worldTransform.toArray(!0)),
        f.uniform1f(e.flipY, d.flipY),
        f.uniform2f(e.projectionVector, g.x, -g.y),
        f.uniform2f(e.offsetVector, -h.x, -h.y),
        f.uniform3fv(e.tintColor, b.hex2rgb(a.tint)),
        f.uniform1f(e.alpha, a.worldAlpha),
        f.bindBuffer(f.ARRAY_BUFFER, c.buffer),
        f.vertexAttribPointer(e.aVertexPosition, 2, f.FLOAT, !1, 24, 0),
        f.vertexAttribPointer(e.colorAttribute, 4, f.FLOAT, !1, 24, 8),
        f.bindBuffer(f.ELEMENT_ARRAY_BUFFER, c.indexBuffer))
    }
    ,
    b.WebGLStencilManager.prototype.popStencil = function(a, b, c) {
        var d = this.gl;
        if (this.stencilStack.pop(),
        this.count--,
        0 === this.stencilStack.length)
            d.disable(d.STENCIL_TEST);
        else {
            var e = this.count;
            this.bindGraphics(a, b, c),
            d.colorMask(!1, !1, !1, !1),
            1 === b.mode ? (this.reverse = !this.reverse,
            this.reverse ? (d.stencilFunc(d.EQUAL, 255 - (e + 1), 255),
            d.stencilOp(d.KEEP, d.KEEP, d.INCR)) : (d.stencilFunc(d.EQUAL, e + 1, 255),
            d.stencilOp(d.KEEP, d.KEEP, d.DECR)),
            d.drawElements(d.TRIANGLE_FAN, 4, d.UNSIGNED_SHORT, 2 * (b.indices.length - 4)),
            d.stencilFunc(d.ALWAYS, 0, 255),
            d.stencilOp(d.KEEP, d.KEEP, d.INVERT),
            d.drawElements(d.TRIANGLE_FAN, b.indices.length - 4, d.UNSIGNED_SHORT, 0),
            this.reverse ? d.stencilFunc(d.EQUAL, e, 255) : d.stencilFunc(d.EQUAL, 255 - e, 255)) : (this.reverse ? (d.stencilFunc(d.EQUAL, e + 1, 255),
            d.stencilOp(d.KEEP, d.KEEP, d.DECR)) : (d.stencilFunc(d.EQUAL, 255 - (e + 1), 255),
            d.stencilOp(d.KEEP, d.KEEP, d.INCR)),
            d.drawElements(d.TRIANGLE_STRIP, b.indices.length, d.UNSIGNED_SHORT, 0),
            this.reverse ? d.stencilFunc(d.EQUAL, e, 255) : d.stencilFunc(d.EQUAL, 255 - e, 255)),
            d.colorMask(!0, !0, !0, !0),
            d.stencilOp(d.KEEP, d.KEEP, d.KEEP)
        }
    }
    ,
    b.WebGLStencilManager.prototype.destroy = function() {
        this.stencilStack = null,
        this.gl = null
    }
    ,
    b.WebGLShaderManager = function() {
        this.maxAttibs = 10,
        this.attribState = [],
        this.tempAttribState = [];
        for (var a = 0; a < this.maxAttibs; a++)
            this.attribState[a] = !1;
        this.stack = []
    }
    ,
    b.WebGLShaderManager.prototype.constructor = b.WebGLShaderManager,
    b.WebGLShaderManager.prototype.setContext = function(a) {
        this.gl = a,
        this.primitiveShader = new b.PrimitiveShader(a),
        this.complexPrimitiveShader = new b.ComplexPrimitiveShader(a),
        this.defaultShader = new b.PixiShader(a),
        this.fastShader = new b.PixiFastShader(a),
        this.stripShader = new b.StripShader(a),
        this.setShader(this.defaultShader)
    }
    ,
    b.WebGLShaderManager.prototype.setAttribs = function(a) {
        var b;
        for (b = 0; b < this.tempAttribState.length; b++)
            this.tempAttribState[b] = !1;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            this.tempAttribState[c] = !0
        }
        var d = this.gl;
        for (b = 0; b < this.attribState.length; b++)
            this.attribState[b] !== this.tempAttribState[b] && (this.attribState[b] = this.tempAttribState[b],
            this.tempAttribState[b] ? d.enableVertexAttribArray(b) : d.disableVertexAttribArray(b))
    }
    ,
    b.WebGLShaderManager.prototype.setShader = function(a) {
        return this._currentId === a._UID ? !1 : (this._currentId = a._UID,
        this.currentShader = a,
        this.gl.useProgram(a.program),
        this.setAttribs(a.attributes),
        !0)
    }
    ,
    b.WebGLShaderManager.prototype.destroy = function() {
        this.attribState = null,
        this.tempAttribState = null,
        this.primitiveShader.destroy(),
        this.complexPrimitiveShader.destroy(),
        this.defaultShader.destroy(),
        this.fastShader.destroy(),
        this.stripShader.destroy(),
        this.gl = null
    }
    ,
    b.WebGLSpriteBatch = function() {
        this.vertSize = 5,
        this.size = 2e3;
        var a = 4 * this.size * 4 * this.vertSize
          , c = 6 * this.size;
        this.vertices = new b.ArrayBuffer(a),
        this.positions = new b.Float32Array(this.vertices),
        this.colors = new b.Uint32Array(this.vertices),
        this.indices = new b.Uint16Array(c),
        this.lastIndexCount = 0;
        for (var d = 0, e = 0; c > d; d += 6,
        e += 4)
            this.indices[d + 0] = e + 0,
            this.indices[d + 1] = e + 1,
            this.indices[d + 2] = e + 2,
            this.indices[d + 3] = e + 0,
            this.indices[d + 4] = e + 2,
            this.indices[d + 5] = e + 3;
        this.drawing = !1,
        this.currentBatchSize = 0,
        this.currentBaseTexture = null,
        this.dirty = !0,
        this.textures = [],
        this.blendModes = [],
        this.shaders = [],
        this.sprites = [],
        this.defaultShader = new b.AbstractFilter(["precision lowp float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;", "}"])
    }
    ,
    b.WebGLSpriteBatch.prototype.setContext = function(a) {
        this.gl = a,
        this.vertexBuffer = a.createBuffer(),
        this.indexBuffer = a.createBuffer(),
        a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.indexBuffer),
        a.bufferData(a.ELEMENT_ARRAY_BUFFER, this.indices, a.STATIC_DRAW),
        a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer),
        a.bufferData(a.ARRAY_BUFFER, this.vertices, a.DYNAMIC_DRAW),
        this.currentBlendMode = 99999;
        var c = new b.PixiShader(a);
        c.fragmentSrc = this.defaultShader.fragmentSrc,
        c.uniforms = {},
        c.init(),
        this.defaultShader.shaders[a.id] = c
    }
    ,
    b.WebGLSpriteBatch.prototype.begin = function(a) {
        this.renderSession = a,
        this.shader = this.renderSession.shaderManager.defaultShader,
        this.start()
    }
    ,
    b.WebGLSpriteBatch.prototype.end = function() {
        this.flush()
    }
    ,
    b.WebGLSpriteBatch.prototype.render = function(a, b) {
        var c = a.texture
          , d = a.worldTransform;
        b && (d = b),
        this.currentBatchSize >= this.size && (this.flush(),
        this.currentBaseTexture = c.baseTexture);
        var e = c._uvs;
        if (e) {
            var f, g, h, i, j = a.anchor.x, k = a.anchor.y;
            if (c.trim) {
                var l = c.trim;
                g = l.x - j * l.width,
                f = g + c.crop.width,
                i = l.y - k * l.height,
                h = i + c.crop.height
            } else
                f = c.frame.width * (1 - j),
                g = c.frame.width * -j,
                h = c.frame.height * (1 - k),
                i = c.frame.height * -k;
            var m = 4 * this.currentBatchSize * this.vertSize
              , n = c.baseTexture.resolution
              , o = d.a / n
              , p = d.b / n
              , q = d.c / n
              , r = d.d / n
              , s = d.tx
              , t = d.ty
              , u = this.colors
              , v = this.positions;
            this.renderSession.roundPixels ? (v[m] = o * g + q * i + s | 0,
            v[m + 1] = r * i + p * g + t | 0,
            v[m + 5] = o * f + q * i + s | 0,
            v[m + 6] = r * i + p * f + t | 0,
            v[m + 10] = o * f + q * h + s | 0,
            v[m + 11] = r * h + p * f + t | 0,
            v[m + 15] = o * g + q * h + s | 0,
            v[m + 16] = r * h + p * g + t | 0) : (v[m] = o * g + q * i + s,
            v[m + 1] = r * i + p * g + t,
            v[m + 5] = o * f + q * i + s,
            v[m + 6] = r * i + p * f + t,
            v[m + 10] = o * f + q * h + s,
            v[m + 11] = r * h + p * f + t,
            v[m + 15] = o * g + q * h + s,
            v[m + 16] = r * h + p * g + t),
            v[m + 2] = e.x0,
            v[m + 3] = e.y0,
            v[m + 7] = e.x1,
            v[m + 8] = e.y1,
            v[m + 12] = e.x2,
            v[m + 13] = e.y2,
            v[m + 17] = e.x3,
            v[m + 18] = e.y3;
            var w = a.tint;
            u[m + 4] = u[m + 9] = u[m + 14] = u[m + 19] = (w >> 16) + (65280 & w) + ((255 & w) << 16) + (255 * a.worldAlpha << 24),
            this.sprites[this.currentBatchSize++] = a
        }
    }
    ,
    b.WebGLSpriteBatch.prototype.renderTilingSprite = function(a) {
        var c = a.tilingTexture;
        this.currentBatchSize >= this.size && (this.flush(),
        this.currentBaseTexture = c.baseTexture),
        a._uvs || (a._uvs = new b.TextureUvs);
        var d = a._uvs
          , e = c.baseTexture.width
          , f = c.baseTexture.height;
        a.tilePosition.x %= e * a.tileScaleOffset.x,
        a.tilePosition.y %= f * a.tileScaleOffset.y;
        var g = a.tilePosition.x / (e * a.tileScaleOffset.x)
          , h = a.tilePosition.y / (f * a.tileScaleOffset.y)
          , i = a.width / e / (a.tileScale.x * a.tileScaleOffset.x)
          , j = a.height / f / (a.tileScale.y * a.tileScaleOffset.y);
        d.x0 = 0 - g,
        d.y0 = 0 - h,
        d.x1 = 1 * i - g,
        d.y1 = 0 - h,
        d.x2 = 1 * i - g,
        d.y2 = 1 * j - h,
        d.x3 = 0 - g,
        d.y3 = 1 * j - h;
        var k = a.tint
          , l = (k >> 16) + (65280 & k) + ((255 & k) << 16) + (255 * a.worldAlpha << 24)
          , m = this.positions
          , n = this.colors
          , o = a.width
          , p = a.height
          , q = a.anchor.x
          , r = a.anchor.y
          , s = o * (1 - q)
          , t = o * -q
          , u = p * (1 - r)
          , v = p * -r
          , w = 4 * this.currentBatchSize * this.vertSize
          , x = c.baseTexture.resolution
          , y = a.worldTransform
          , z = y.a / x
          , A = y.b / x
          , B = y.c / x
          , C = y.d / x
          , D = y.tx
          , E = y.ty;
        m[w++] = z * t + B * v + D,
        m[w++] = C * v + A * t + E,
        m[w++] = d.x0,
        m[w++] = d.y0,
        n[w++] = l,
        m[w++] = z * s + B * v + D,
        m[w++] = C * v + A * s + E,
        m[w++] = d.x1,
        m[w++] = d.y1,
        n[w++] = l,
        m[w++] = z * s + B * u + D,
        m[w++] = C * u + A * s + E,
        m[w++] = d.x2,
        m[w++] = d.y2,
        n[w++] = l,
        m[w++] = z * t + B * u + D,
        m[w++] = C * u + A * t + E,
        m[w++] = d.x3,
        m[w++] = d.y3,
        n[w++] = l,
        this.sprites[this.currentBatchSize++] = a
    }
    ,
    b.WebGLSpriteBatch.prototype.flush = function() {
        if (0 !== this.currentBatchSize) {
            var a, c = this.gl;
            if (this.dirty) {
                this.dirty = !1,
                c.activeTexture(c.TEXTURE0),
                c.bindBuffer(c.ARRAY_BUFFER, this.vertexBuffer),
                c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, this.indexBuffer),
                a = this.defaultShader.shaders[c.id];
                var d = 4 * this.vertSize;
                c.vertexAttribPointer(a.aVertexPosition, 2, c.FLOAT, !1, d, 0),
                c.vertexAttribPointer(a.aTextureCoord, 2, c.FLOAT, !1, d, 8),
                c.vertexAttribPointer(a.colorAttribute, 4, c.UNSIGNED_BYTE, !0, d, 16)
            }
            if (this.currentBatchSize > .5 * this.size)
                c.bufferSubData(c.ARRAY_BUFFER, 0, this.vertices);
            else {
                var e = this.positions.subarray(0, 4 * this.currentBatchSize * this.vertSize);
                c.bufferSubData(c.ARRAY_BUFFER, 0, e)
            }
            for (var f, g, h, i, j = 0, k = 0, l = null, m = this.renderSession.blendModeManager.currentBlendMode, n = null, o = !1, p = !1, q = 0, r = this.currentBatchSize; r > q; q++) {
                if (i = this.sprites[q],
                f = i.tilingTexture ? i.tilingTexture.baseTexture : i.texture.baseTexture,
                g = i.blendMode,
                h = i.shader || this.defaultShader,
                o = m !== g,
                p = n !== h,
                (l !== f || o || p) && (this.renderBatch(l, j, k),
                k = q,
                j = 0,
                l = f,
                o && (m = g,
                this.renderSession.blendModeManager.setBlendMode(m)),
                p)) {
                    n = h,
                    a = n.shaders[c.id],
                    a || (a = new b.PixiShader(c),
                    a.fragmentSrc = n.fragmentSrc,
                    a.uniforms = n.uniforms,
                    a.init(),
                    n.shaders[c.id] = a),
                    this.renderSession.shaderManager.setShader(a),
                    a.dirty && a.syncUniforms();
                    var s = this.renderSession.projection;
                    c.uniform2f(a.projectionVector, s.x, s.y);
                    var t = this.renderSession.offset;
                    c.uniform2f(a.offsetVector, t.x, t.y)
                }
                j++
            }
            this.renderBatch(l, j, k),
            this.currentBatchSize = 0
        }
    }
    ,
    b.WebGLSpriteBatch.prototype.renderBatch = function(a, b, c) {
        if (0 !== b) {
            var d = this.gl;
            a._dirty[d.id] ? this.renderSession.renderer.updateTexture(a) : d.bindTexture(d.TEXTURE_2D, a._glTextures[d.id]),
            d.drawElements(d.TRIANGLES, 6 * b, d.UNSIGNED_SHORT, 6 * c * 2),
            this.renderSession.drawCount++
        }
    }
    ,
    b.WebGLSpriteBatch.prototype.stop = function() {
        this.flush(),
        this.dirty = !0
    }
    ,
    b.WebGLSpriteBatch.prototype.start = function() {
        this.dirty = !0
    }
    ,
    b.WebGLSpriteBatch.prototype.destroy = function() {
        this.vertices = null,
        this.indices = null,
        this.gl.deleteBuffer(this.vertexBuffer),
        this.gl.deleteBuffer(this.indexBuffer),
        this.currentBaseTexture = null,
        this.gl = null
    }
    ,
    b.WebGLFastSpriteBatch = function(a) {
        this.vertSize = 10,
        this.maxSize = 6e3,
        this.size = this.maxSize;
        var c = 4 * this.size * this.vertSize
          , d = 6 * this.maxSize;
        this.vertices = new b.Float32Array(c),
        this.indices = new b.Uint16Array(d),
        this.vertexBuffer = null,
        this.indexBuffer = null,
        this.lastIndexCount = 0;
        for (var e = 0, f = 0; d > e; e += 6,
        f += 4)
            this.indices[e + 0] = f + 0,
            this.indices[e + 1] = f + 1,
            this.indices[e + 2] = f + 2,
            this.indices[e + 3] = f + 0,
            this.indices[e + 4] = f + 2,
            this.indices[e + 5] = f + 3;
        this.drawing = !1,
        this.currentBatchSize = 0,
        this.currentBaseTexture = null,
        this.currentBlendMode = 0,
        this.renderSession = null,
        this.shader = null,
        this.matrix = null,
        this.setContext(a)
    }
    ,
    b.WebGLFastSpriteBatch.prototype.constructor = b.WebGLFastSpriteBatch,
    b.WebGLFastSpriteBatch.prototype.setContext = function(a) {
        this.gl = a,
        this.vertexBuffer = a.createBuffer(),
        this.indexBuffer = a.createBuffer(),
        a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.indexBuffer),
        a.bufferData(a.ELEMENT_ARRAY_BUFFER, this.indices, a.STATIC_DRAW),
        a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer),
        a.bufferData(a.ARRAY_BUFFER, this.vertices, a.DYNAMIC_DRAW)
    }
    ,
    b.WebGLFastSpriteBatch.prototype.begin = function(a, b) {
        this.renderSession = b,
        this.shader = this.renderSession.shaderManager.fastShader,
        this.matrix = a.worldTransform.toArray(!0),
        this.start()
    }
    ,
    b.WebGLFastSpriteBatch.prototype.end = function() {
        this.flush()
    }
    ,
    b.WebGLFastSpriteBatch.prototype.render = function(a) {
        var b = a.children
          , c = b[0];
        if (c.texture._uvs) {
            this.currentBaseTexture = c.texture.baseTexture,
            c.blendMode !== this.renderSession.blendModeManager.currentBlendMode && (this.flush(),
            this.renderSession.blendModeManager.setBlendMode(c.blendMode));
            for (var d = 0, e = b.length; e > d; d++)
                this.renderSprite(b[d]);
            this.flush()
        }
    }
    ,
    b.WebGLFastSpriteBatch.prototype.renderSprite = function(a) {
        if (a.visible && (a.texture.baseTexture === this.currentBaseTexture || (this.flush(),
        this.currentBaseTexture = a.texture.baseTexture,
        a.texture._uvs))) {
            var b, c, d, e, f, g, h, i, j = this.vertices;
            if (b = a.texture._uvs,
            c = a.texture.frame.width,
            d = a.texture.frame.height,
            a.texture.trim) {
                var k = a.texture.trim;
                f = k.x - a.anchor.x * k.width,
                e = f + a.texture.crop.width,
                h = k.y - a.anchor.y * k.height,
                g = h + a.texture.crop.height
            } else
                e = a.texture.frame.width * (1 - a.anchor.x),
                f = a.texture.frame.width * -a.anchor.x,
                g = a.texture.frame.height * (1 - a.anchor.y),
                h = a.texture.frame.height * -a.anchor.y;
            i = 4 * this.currentBatchSize * this.vertSize,
            j[i++] = f,
            j[i++] = h,
            j[i++] = a.position.x,
            j[i++] = a.position.y,
            j[i++] = a.scale.x,
            j[i++] = a.scale.y,
            j[i++] = a.rotation,
            j[i++] = b.x0,
            j[i++] = b.y1,
            j[i++] = a.alpha,
            j[i++] = e,
            j[i++] = h,
            j[i++] = a.position.x,
            j[i++] = a.position.y,
            j[i++] = a.scale.x,
            j[i++] = a.scale.y,
            j[i++] = a.rotation,
            j[i++] = b.x1,
            j[i++] = b.y1,
            j[i++] = a.alpha,
            j[i++] = e,
            j[i++] = g,
            j[i++] = a.position.x,
            j[i++] = a.position.y,
            j[i++] = a.scale.x,
            j[i++] = a.scale.y,
            j[i++] = a.rotation,
            j[i++] = b.x2,
            j[i++] = b.y2,
            j[i++] = a.alpha,
            j[i++] = f,
            j[i++] = g,
            j[i++] = a.position.x,
            j[i++] = a.position.y,
            j[i++] = a.scale.x,
            j[i++] = a.scale.y,
            j[i++] = a.rotation,
            j[i++] = b.x3,
            j[i++] = b.y3,
            j[i++] = a.alpha,
            this.currentBatchSize++,
            this.currentBatchSize >= this.size && this.flush()
        }
    }
    ,
    b.WebGLFastSpriteBatch.prototype.flush = function() {
        if (0 !== this.currentBatchSize) {
            var a = this.gl;
            if (this.currentBaseTexture._glTextures[a.id] || this.renderSession.renderer.updateTexture(this.currentBaseTexture, a),
            a.bindTexture(a.TEXTURE_2D, this.currentBaseTexture._glTextures[a.id]),
            this.currentBatchSize > .5 * this.size)
                a.bufferSubData(a.ARRAY_BUFFER, 0, this.vertices);
            else {
                var b = this.vertices.subarray(0, 4 * this.currentBatchSize * this.vertSize);
                a.bufferSubData(a.ARRAY_BUFFER, 0, b)
            }
            a.drawElements(a.TRIANGLES, 6 * this.currentBatchSize, a.UNSIGNED_SHORT, 0),
            this.currentBatchSize = 0,
            this.renderSession.drawCount++
        }
    }
    ,
    b.WebGLFastSpriteBatch.prototype.stop = function() {
        this.flush()
    }
    ,
    b.WebGLFastSpriteBatch.prototype.start = function() {
        var a = this.gl;
        a.activeTexture(a.TEXTURE0),
        a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer),
        a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        var b = this.renderSession.projection;
        a.uniform2f(this.shader.projectionVector, b.x, b.y),
        a.uniformMatrix3fv(this.shader.uMatrix, !1, this.matrix);
        var c = 4 * this.vertSize;
        a.vertexAttribPointer(this.shader.aVertexPosition, 2, a.FLOAT, !1, c, 0),
        a.vertexAttribPointer(this.shader.aPositionCoord, 2, a.FLOAT, !1, c, 8),
        a.vertexAttribPointer(this.shader.aScale, 2, a.FLOAT, !1, c, 16),
        a.vertexAttribPointer(this.shader.aRotation, 1, a.FLOAT, !1, c, 24),
        a.vertexAttribPointer(this.shader.aTextureCoord, 2, a.FLOAT, !1, c, 28),
        a.vertexAttribPointer(this.shader.colorAttribute, 1, a.FLOAT, !1, c, 36)
    }
    ,
    b.WebGLFilterManager = function() {
        this.filterStack = [],
        this.offsetX = 0,
        this.offsetY = 0
    }
    ,
    b.WebGLFilterManager.prototype.constructor = b.WebGLFilterManager,
    b.WebGLFilterManager.prototype.setContext = function(a) {
        this.gl = a,
        this.texturePool = [],
        this.initShaderBuffers()
    }
    ,
    b.WebGLFilterManager.prototype.begin = function(a, b) {
        this.renderSession = a,
        this.defaultShader = a.shaderManager.defaultShader;
        var c = this.renderSession.projection;
        this.width = 2 * c.x,
        this.height = 2 * -c.y,
        this.buffer = b
    }
    ,
    b.WebGLFilterManager.prototype.pushFilter = function(a) {
        var c = this.gl
          , d = this.renderSession.projection
          , e = this.renderSession.offset;
        a._filterArea = a.target.filterArea || a.target.getBounds(),
        this.filterStack.push(a);
        var f = a.filterPasses[0];
        this.offsetX += a._filterArea.x,
        this.offsetY += a._filterArea.y;
        var g = this.texturePool.pop();
        g ? g.resize(this.width, this.height) : g = new b.FilterTexture(this.gl,this.width,this.height),
        c.bindTexture(c.TEXTURE_2D, g.texture);
        var h = a._filterArea
          , i = f.padding;
        h.x -= i,
        h.y -= i,
        h.width += 2 * i,
        h.height += 2 * i,
        h.x < 0 && (h.x = 0),
        h.width > this.width && (h.width = this.width),
        h.y < 0 && (h.y = 0),
        h.height > this.height && (h.height = this.height),
        c.bindFramebuffer(c.FRAMEBUFFER, g.frameBuffer),
        c.viewport(0, 0, h.width, h.height),
        d.x = h.width / 2,
        d.y = -h.height / 2,
        e.x = -h.x,
        e.y = -h.y,
        c.colorMask(!0, !0, !0, !0),
        c.clearColor(0, 0, 0, 0),
        c.clear(c.COLOR_BUFFER_BIT),
        a._glFilterTexture = g
    }
    ,
    b.WebGLFilterManager.prototype.popFilter = function() {
        var a = this.gl
          , c = this.filterStack.pop()
          , d = c._filterArea
          , e = c._glFilterTexture
          , f = this.renderSession.projection
          , g = this.renderSession.offset;
        if (c.filterPasses.length > 1) {
            a.viewport(0, 0, d.width, d.height),
            a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer),
            this.vertexArray[0] = 0,
            this.vertexArray[1] = d.height,
            this.vertexArray[2] = d.width,
            this.vertexArray[3] = d.height,
            this.vertexArray[4] = 0,
            this.vertexArray[5] = 0,
            this.vertexArray[6] = d.width,
            this.vertexArray[7] = 0,
            a.bufferSubData(a.ARRAY_BUFFER, 0, this.vertexArray),
            a.bindBuffer(a.ARRAY_BUFFER, this.uvBuffer),
            this.uvArray[2] = d.width / this.width,
            this.uvArray[5] = d.height / this.height,
            this.uvArray[6] = d.width / this.width,
            this.uvArray[7] = d.height / this.height,
            a.bufferSubData(a.ARRAY_BUFFER, 0, this.uvArray);
            var h = e
              , i = this.texturePool.pop();
            i || (i = new b.FilterTexture(this.gl,this.width,this.height)),
            i.resize(this.width, this.height),
            a.bindFramebuffer(a.FRAMEBUFFER, i.frameBuffer),
            a.clear(a.COLOR_BUFFER_BIT),
            a.disable(a.BLEND);
            for (var j = 0; j < c.filterPasses.length - 1; j++) {
                var k = c.filterPasses[j];
                a.bindFramebuffer(a.FRAMEBUFFER, i.frameBuffer),
                a.activeTexture(a.TEXTURE0),
                a.bindTexture(a.TEXTURE_2D, h.texture),
                this.applyFilterPass(k, d, d.width, d.height);
                var l = h;
                h = i,
                i = l
            }
            a.enable(a.BLEND),
            e = h,
            this.texturePool.push(i)
        }
        var m = c.filterPasses[c.filterPasses.length - 1];
        this.offsetX -= d.x,
        this.offsetY -= d.y;
        var n = this.width
          , o = this.height
          , p = 0
          , q = 0
          , r = this.buffer;
        if (0 === this.filterStack.length)
            a.colorMask(!0, !0, !0, !0);
        else {
            var s = this.filterStack[this.filterStack.length - 1];
            d = s._filterArea,
            n = d.width,
            o = d.height,
            p = d.x,
            q = d.y,
            r = s._glFilterTexture.frameBuffer
        }
        f.x = n / 2,
        f.y = -o / 2,
        g.x = p,
        g.y = q,
        d = c._filterArea;
        var t = d.x - p
          , u = d.y - q;
        a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer),
        this.vertexArray[0] = t,
        this.vertexArray[1] = u + d.height,
        this.vertexArray[2] = t + d.width,
        this.vertexArray[3] = u + d.height,
        this.vertexArray[4] = t,
        this.vertexArray[5] = u,
        this.vertexArray[6] = t + d.width,
        this.vertexArray[7] = u,
        a.bufferSubData(a.ARRAY_BUFFER, 0, this.vertexArray),
        a.bindBuffer(a.ARRAY_BUFFER, this.uvBuffer),
        this.uvArray[2] = d.width / this.width,
        this.uvArray[5] = d.height / this.height,
        this.uvArray[6] = d.width / this.width,
        this.uvArray[7] = d.height / this.height,
        a.bufferSubData(a.ARRAY_BUFFER, 0, this.uvArray),
        a.viewport(0, 0, n * this.renderSession.resolution, o * this.renderSession.resolution),
        a.bindFramebuffer(a.FRAMEBUFFER, r),
        a.activeTexture(a.TEXTURE0),
        a.bindTexture(a.TEXTURE_2D, e.texture),
        this.applyFilterPass(m, d, n, o),
        this.texturePool.push(e),
        c._glFilterTexture = null
    }
    ,
    b.WebGLFilterManager.prototype.applyFilterPass = function(a, c, d, e) {
        var f = this.gl
          , g = a.shaders[f.id];
        g || (g = new b.PixiShader(f),
        g.fragmentSrc = a.fragmentSrc,
        g.uniforms = a.uniforms,
        g.init(),
        a.shaders[f.id] = g),
        this.renderSession.shaderManager.setShader(g),
        f.uniform2f(g.projectionVector, d / 2, -e / 2),
        f.uniform2f(g.offsetVector, 0, 0),
        a.uniforms.dimensions && (a.uniforms.dimensions.value[0] = this.width,
        a.uniforms.dimensions.value[1] = this.height,
        a.uniforms.dimensions.value[2] = this.vertexArray[0],
        a.uniforms.dimensions.value[3] = this.vertexArray[5]),
        g.syncUniforms(),
        f.bindBuffer(f.ARRAY_BUFFER, this.vertexBuffer),
        f.vertexAttribPointer(g.aVertexPosition, 2, f.FLOAT, !1, 0, 0),
        f.bindBuffer(f.ARRAY_BUFFER, this.uvBuffer),
        f.vertexAttribPointer(g.aTextureCoord, 2, f.FLOAT, !1, 0, 0),
        f.bindBuffer(f.ARRAY_BUFFER, this.colorBuffer),
        f.vertexAttribPointer(g.colorAttribute, 2, f.FLOAT, !1, 0, 0),
        f.bindBuffer(f.ELEMENT_ARRAY_BUFFER, this.indexBuffer),
        f.drawElements(f.TRIANGLES, 6, f.UNSIGNED_SHORT, 0),
        this.renderSession.drawCount++
    }
    ,
    b.WebGLFilterManager.prototype.initShaderBuffers = function() {
        var a = this.gl;
        this.vertexBuffer = a.createBuffer(),
        this.uvBuffer = a.createBuffer(),
        this.colorBuffer = a.createBuffer(),
        this.indexBuffer = a.createBuffer(),
        this.vertexArray = new b.Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
        a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer),
        a.bufferData(a.ARRAY_BUFFER, this.vertexArray, a.STATIC_DRAW),
        this.uvArray = new b.Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
        a.bindBuffer(a.ARRAY_BUFFER, this.uvBuffer),
        a.bufferData(a.ARRAY_BUFFER, this.uvArray, a.STATIC_DRAW),
        this.colorArray = new b.Float32Array([1, 16777215, 1, 16777215, 1, 16777215, 1, 16777215]),
        a.bindBuffer(a.ARRAY_BUFFER, this.colorBuffer),
        a.bufferData(a.ARRAY_BUFFER, this.colorArray, a.STATIC_DRAW),
        a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.indexBuffer),
        a.bufferData(a.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 1, 3, 2]), a.STATIC_DRAW)
    }
    ,
    b.WebGLFilterManager.prototype.destroy = function() {
        var a = this.gl;
        this.filterStack = null,
        this.offsetX = 0,
        this.offsetY = 0;
        for (var b = 0; b < this.texturePool.length; b++)
            this.texturePool[b].destroy();
        this.texturePool = null,
        a.deleteBuffer(this.vertexBuffer),
        a.deleteBuffer(this.uvBuffer),
        a.deleteBuffer(this.colorBuffer),
        a.deleteBuffer(this.indexBuffer)
    }
    ,
    b.FilterTexture = function(a, c, d, e) {
        this.gl = a,
        this.frameBuffer = a.createFramebuffer(),
        this.texture = a.createTexture(),
        e = e || b.scaleModes.DEFAULT,
        a.bindTexture(a.TEXTURE_2D, this.texture),
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, e === b.scaleModes.LINEAR ? a.LINEAR : a.NEAREST),
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, e === b.scaleModes.LINEAR ? a.LINEAR : a.NEAREST),
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, a.CLAMP_TO_EDGE),
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, a.CLAMP_TO_EDGE),
        a.bindFramebuffer(a.FRAMEBUFFER, this.frameBuffer),
        a.bindFramebuffer(a.FRAMEBUFFER, this.frameBuffer),
        a.framebufferTexture2D(a.FRAMEBUFFER, a.COLOR_ATTACHMENT0, a.TEXTURE_2D, this.texture, 0),
        this.renderBuffer = a.createRenderbuffer(),
        a.bindRenderbuffer(a.RENDERBUFFER, this.renderBuffer),
        a.framebufferRenderbuffer(a.FRAMEBUFFER, a.DEPTH_STENCIL_ATTACHMENT, a.RENDERBUFFER, this.renderBuffer),
        this.resize(c, d)
    }
    ,
    b.FilterTexture.prototype.constructor = b.FilterTexture,
    b.FilterTexture.prototype.clear = function() {
        var a = this.gl;
        a.clearColor(0, 0, 0, 0),
        a.clear(a.COLOR_BUFFER_BIT)
    }
    ,
    b.FilterTexture.prototype.resize = function(a, b) {
        if (this.width !== a || this.height !== b) {
            this.width = a,
            this.height = b;
            var c = this.gl;
            c.bindTexture(c.TEXTURE_2D, this.texture),
            c.texImage2D(c.TEXTURE_2D, 0, c.RGBA, a, b, 0, c.RGBA, c.UNSIGNED_BYTE, null),
            c.bindRenderbuffer(c.RENDERBUFFER, this.renderBuffer),
            c.renderbufferStorage(c.RENDERBUFFER, c.DEPTH_STENCIL, a, b)
        }
    }
    ,
    b.FilterTexture.prototype.destroy = function() {
        var a = this.gl;
        a.deleteFramebuffer(this.frameBuffer),
        a.deleteTexture(this.texture),
        this.frameBuffer = null,
        this.texture = null
    }
    ,
    b.CanvasBuffer = function(a, c) {
        this.width = a,
        this.height = c,
        this.canvas = b.CanvasPool.create(this, this.width, this.height),
        this.context = this.canvas.getContext("2d"),
        this.canvas.width = a,
        this.canvas.height = c
    }
    ,
    b.CanvasBuffer.prototype.constructor = b.CanvasBuffer,
    b.CanvasBuffer.prototype.clear = function() {
        this.context.setTransform(1, 0, 0, 1, 0, 0),
        this.context.clearRect(0, 0, this.width, this.height)
    }
    ,
    b.CanvasBuffer.prototype.resize = function(a, b) {
        this.width = this.canvas.width = a,
        this.height = this.canvas.height = b
    }
    ,
    b.CanvasBuffer.prototype.destroy = function() {
        b.CanvasPool.remove(this)
    }
    ,
    b.CanvasMaskManager = function() {}
    ,
    b.CanvasMaskManager.prototype.constructor = b.CanvasMaskManager,
    b.CanvasMaskManager.prototype.pushMask = function(a, c) {
        var d = c.context;
        d.save();
        var e = a.alpha
          , f = a.worldTransform
          , g = c.resolution;
        d.setTransform(f.a * g, f.b * g, f.c * g, f.d * g, f.tx * g, f.ty * g),
        b.CanvasGraphics.renderGraphicsMask(a, d),
        d.clip(),
        a.worldAlpha = e
    }
    ,
    b.CanvasMaskManager.prototype.popMask = function(a) {
        a.context.restore()
    }
    ,
    b.CanvasTinter = function() {}
    ,
    b.CanvasTinter.getTintedTexture = function(a, c) {
        var d = a.tintedTexture || b.CanvasPool.create(this);
        return b.CanvasTinter.tintMethod(a.texture, c, d),
        d
    }
    ,
    b.CanvasTinter.tintWithMultiply = function(a, b, c) {
        var d = c.getContext("2d")
          , e = a.crop;
        (c.width !== e.width || c.height !== e.height) && (c.width = e.width,
        c.height = e.height),
        d.clearRect(0, 0, e.width, e.height),
        d.fillStyle = "#" + ("00000" + (0 | b).toString(16)).substr(-6),
        d.fillRect(0, 0, e.width, e.height),
        d.globalCompositeOperation = "multiply",
        d.drawImage(a.baseTexture.source, e.x, e.y, e.width, e.height, 0, 0, e.width, e.height),
        d.globalCompositeOperation = "destination-atop",
        d.drawImage(a.baseTexture.source, e.x, e.y, e.width, e.height, 0, 0, e.width, e.height)
    }
    ,
    b.CanvasTinter.tintWithPerPixel = function(a, c, d) {
        var e = d.getContext("2d")
          , f = a.crop;
        d.width = f.width,
        d.height = f.height,
        e.globalCompositeOperation = "copy",
        e.drawImage(a.baseTexture.source, f.x, f.y, f.width, f.height, 0, 0, f.width, f.height);
        for (var g = b.hex2rgb(c), h = g[0], i = g[1], j = g[2], k = e.getImageData(0, 0, f.width, f.height), l = k.data, m = 0; m < l.length; m += 4)
            if (l[m + 0] *= h,
            l[m + 1] *= i,
            l[m + 2] *= j,
            !b.CanvasTinter.canHandleAlpha) {
                var n = l[m + 3];
                l[m + 0] /= 255 / n,
                l[m + 1] /= 255 / n,
                l[m + 2] /= 255 / n
            }
        e.putImageData(k, 0, 0)
    }
    ,
    b.CanvasTinter.checkInverseAlpha = function() {
        var a = new b.CanvasBuffer(2,1);
        a.context.fillStyle = "rgba(10, 20, 30, 0.5)",
        a.context.fillRect(0, 0, 1, 1);
        var c = a.context.getImageData(0, 0, 1, 1);
        if (null === c)
            return !1;
        a.context.putImageData(c, 1, 0);
        var d = a.context.getImageData(1, 0, 1, 1);
        return d.data[0] === c.data[0] && d.data[1] === c.data[1] && d.data[2] === c.data[2] && d.data[3] === c.data[3]
    }
    ,
    b.CanvasTinter.canHandleAlpha = b.CanvasTinter.checkInverseAlpha(),
    b.CanvasTinter.canUseMultiply = b.canUseNewCanvasBlendModes(),
    b.CanvasTinter.tintMethod = b.CanvasTinter.canUseMultiply ? b.CanvasTinter.tintWithMultiply : b.CanvasTinter.tintWithPerPixel,
    b.CanvasRenderer = function(a, c, d) {
        if (d)
            for (var e in b.defaultRenderOptions)
                void 0 === d[e] && (d[e] = b.defaultRenderOptions[e]);
        else
            d = b.defaultRenderOptions;
        b.defaultRenderer || (b.defaultRenderer = this),
        this.type = b.CANVAS_RENDERER,
        this.resolution = d.resolution,
        this.clearBeforeRender = d.clearBeforeRender,
        this.transparent = d.transparent,
        this.autoResize = d.autoResize || !1,
        this.width = a || 800,
        this.height = c || 600,
        this.width *= this.resolution,
        this.height *= this.resolution,
        this.view = d.view || b.CanvasPool.create(this, this.width, this.height),
        this.context = this.view.getContext("2d", {
            alpha: this.transparent
        }),
        this.refresh = !0,
        this.view.width = this.width * this.resolution,
        this.view.height = this.height * this.resolution,
        this.count = 0,
        this.maskManager = new b.CanvasMaskManager,
        this.renderSession = {
            context: this.context,
            maskManager: this.maskManager,
            scaleMode: null,
            smoothProperty: null,
            roundPixels: !1
        },
        this.mapBlendModes(),
        this.resize(a, c),
        "imageSmoothingEnabled"in this.context ? this.renderSession.smoothProperty = "imageSmoothingEnabled" : "webkitImageSmoothingEnabled"in this.context ? this.renderSession.smoothProperty = "webkitImageSmoothingEnabled" : "mozImageSmoothingEnabled"in this.context ? this.renderSession.smoothProperty = "mozImageSmoothingEnabled" : "oImageSmoothingEnabled"in this.context ? this.renderSession.smoothProperty = "oImageSmoothingEnabled" : "msImageSmoothingEnabled"in this.context && (this.renderSession.smoothProperty = "msImageSmoothingEnabled")
    }
    ,
    b.CanvasRenderer.prototype.constructor = b.CanvasRenderer,
    b.CanvasRenderer.prototype.render = function(a) {
        a.updateTransform(),
        this.context.setTransform(1, 0, 0, 1, 0, 0),
        this.context.globalAlpha = 1,
        this.renderSession.currentBlendMode = b.blendModes.NORMAL,
        this.context.globalCompositeOperation = b.blendModesCanvas[b.blendModes.NORMAL],
        navigator.isCocoonJS && this.view.screencanvas && (this.context.fillStyle = "black",
        this.context.clear()),
        this.clearBeforeRender && (this.transparent ? this.context.clearRect(0, 0, this.width, this.height) : (this.context.fillStyle = a.backgroundColorString,
        this.context.fillRect(0, 0, this.width, this.height))),
        this.renderDisplayObject(a)
    }
    ,
    b.CanvasRenderer.prototype.destroy = function(a) {
        void 0 === a && (a = !0),
        a && this.view.parent && this.view.parent.removeChild(this.view),
        this.view = null,
        this.context = null,
        this.maskManager = null,
        this.renderSession = null
    }
    ,
    b.CanvasRenderer.prototype.resize = function(a, b) {
        this.width = a * this.resolution,
        this.height = b * this.resolution,
        this.view.width = this.width,
        this.view.height = this.height,
        this.autoResize && (this.view.style.width = this.width / this.resolution + "px",
        this.view.style.height = this.height / this.resolution + "px")
    }
    ,
    b.CanvasRenderer.prototype.renderDisplayObject = function(a, b, c) {
        this.renderSession.context = b || this.context,
        this.renderSession.resolution = this.resolution,
        a._renderCanvas(this.renderSession, c)
    }
    ,
    b.CanvasRenderer.prototype.mapBlendModes = function() {
        b.blendModesCanvas || (b.blendModesCanvas = [],
        b.canUseNewCanvasBlendModes() ? (b.blendModesCanvas[b.blendModes.NORMAL] = "source-over",
        b.blendModesCanvas[b.blendModes.ADD] = "lighter",
        b.blendModesCanvas[b.blendModes.MULTIPLY] = "multiply",
        b.blendModesCanvas[b.blendModes.SCREEN] = "screen",
        b.blendModesCanvas[b.blendModes.OVERLAY] = "overlay",
        b.blendModesCanvas[b.blendModes.DARKEN] = "darken",
        b.blendModesCanvas[b.blendModes.LIGHTEN] = "lighten",
        b.blendModesCanvas[b.blendModes.COLOR_DODGE] = "color-dodge",
        b.blendModesCanvas[b.blendModes.COLOR_BURN] = "color-burn",
        b.blendModesCanvas[b.blendModes.HARD_LIGHT] = "hard-light",
        b.blendModesCanvas[b.blendModes.SOFT_LIGHT] = "soft-light",
        b.blendModesCanvas[b.blendModes.DIFFERENCE] = "difference",
        b.blendModesCanvas[b.blendModes.EXCLUSION] = "exclusion",
        b.blendModesCanvas[b.blendModes.HUE] = "hue",
        b.blendModesCanvas[b.blendModes.SATURATION] = "saturation",
        b.blendModesCanvas[b.blendModes.COLOR] = "color",
        b.blendModesCanvas[b.blendModes.LUMINOSITY] = "luminosity") : (b.blendModesCanvas[b.blendModes.NORMAL] = "source-over",
        b.blendModesCanvas[b.blendModes.ADD] = "lighter",
        b.blendModesCanvas[b.blendModes.MULTIPLY] = "source-over",
        b.blendModesCanvas[b.blendModes.SCREEN] = "source-over",
        b.blendModesCanvas[b.blendModes.OVERLAY] = "source-over",
        b.blendModesCanvas[b.blendModes.DARKEN] = "source-over",
        b.blendModesCanvas[b.blendModes.LIGHTEN] = "source-over",
        b.blendModesCanvas[b.blendModes.COLOR_DODGE] = "source-over",
        b.blendModesCanvas[b.blendModes.COLOR_BURN] = "source-over",
        b.blendModesCanvas[b.blendModes.HARD_LIGHT] = "source-over",
        b.blendModesCanvas[b.blendModes.SOFT_LIGHT] = "source-over",
        b.blendModesCanvas[b.blendModes.DIFFERENCE] = "source-over",
        b.blendModesCanvas[b.blendModes.EXCLUSION] = "source-over",
        b.blendModesCanvas[b.blendModes.HUE] = "source-over",
        b.blendModesCanvas[b.blendModes.SATURATION] = "source-over",
        b.blendModesCanvas[b.blendModes.COLOR] = "source-over",
        b.blendModesCanvas[b.blendModes.LUMINOSITY] = "source-over"))
    }
    ,
    b.CanvasGraphics = function() {}
    ,
    b.CanvasGraphics.renderGraphics = function(a, c) {
        var d = a.worldAlpha;
        a.dirty && (this.updateGraphicsTint(a),
        a.dirty = !1);
        for (var e = 0; e < a.graphicsData.length; e++) {
            var f = a.graphicsData[e]
              , g = f.shape
              , h = f._fillTint
              , i = f._lineTint;
            if (c.lineWidth = f.lineWidth,
            f.type === b.Graphics.POLY) {
                c.beginPath();
                var j = g.points;
                c.moveTo(j[0], j[1]);
                for (var k = 1; k < j.length / 2; k++)
                    c.lineTo(j[2 * k], j[2 * k + 1]);
                g.closed && c.lineTo(j[0], j[1]),
                j[0] === j[j.length - 2] && j[1] === j[j.length - 1] && c.closePath(),
                f.fill && (c.globalAlpha = f.fillAlpha * d,
                c.fillStyle = "#" + ("00000" + (0 | h).toString(16)).substr(-6),
                c.fill()),
                f.lineWidth && (c.globalAlpha = f.lineAlpha * d,
                c.strokeStyle = "#" + ("00000" + (0 | i).toString(16)).substr(-6),
                c.stroke())
            } else if (f.type === b.Graphics.RECT)
                (f.fillColor || 0 === f.fillColor) && (c.globalAlpha = f.fillAlpha * d,
                c.fillStyle = "#" + ("00000" + (0 | h).toString(16)).substr(-6),
                c.fillRect(g.x, g.y, g.width, g.height)),
                f.lineWidth && (c.globalAlpha = f.lineAlpha * d,
                c.strokeStyle = "#" + ("00000" + (0 | i).toString(16)).substr(-6),
                c.strokeRect(g.x, g.y, g.width, g.height));
            else if (f.type === b.Graphics.CIRC)
                c.beginPath(),
                c.arc(g.x, g.y, g.radius, 0, 2 * Math.PI),
                c.closePath(),
                f.fill && (c.globalAlpha = f.fillAlpha * d,
                c.fillStyle = "#" + ("00000" + (0 | h).toString(16)).substr(-6),
                c.fill()),
                f.lineWidth && (c.globalAlpha = f.lineAlpha * d,
                c.strokeStyle = "#" + ("00000" + (0 | i).toString(16)).substr(-6),
                c.stroke());
            else if (f.type === b.Graphics.ELIP) {
                var l = 2 * g.width
                  , m = 2 * g.height
                  , n = g.x - l / 2
                  , o = g.y - m / 2;
                c.beginPath();
                var p = .5522848
                  , q = l / 2 * p
                  , r = m / 2 * p
                  , s = n + l
                  , t = o + m
                  , u = n + l / 2
                  , v = o + m / 2;
                c.moveTo(n, v),
                c.bezierCurveTo(n, v - r, u - q, o, u, o),
                c.bezierCurveTo(u + q, o, s, v - r, s, v),
                c.bezierCurveTo(s, v + r, u + q, t, u, t),
                c.bezierCurveTo(u - q, t, n, v + r, n, v),
                c.closePath(),
                f.fill && (c.globalAlpha = f.fillAlpha * d,
                c.fillStyle = "#" + ("00000" + (0 | h).toString(16)).substr(-6),
                c.fill()),
                f.lineWidth && (c.globalAlpha = f.lineAlpha * d,
                c.strokeStyle = "#" + ("00000" + (0 | i).toString(16)).substr(-6),
                c.stroke())
            } else if (f.type === b.Graphics.RREC) {
                var w = g.x
                  , x = g.y
                  , y = g.width
                  , z = g.height
                  , A = g.radius
                  , B = Math.min(y, z) / 2 | 0;
                A = A > B ? B : A,
                c.beginPath(),
                c.moveTo(w, x + A),
                c.lineTo(w, x + z - A),
                c.quadraticCurveTo(w, x + z, w + A, x + z),
                c.lineTo(w + y - A, x + z),
                c.quadraticCurveTo(w + y, x + z, w + y, x + z - A),
                c.lineTo(w + y, x + A),
                c.quadraticCurveTo(w + y, x, w + y - A, x),
                c.lineTo(w + A, x),
                c.quadraticCurveTo(w, x, w, x + A),
                c.closePath(),
                (f.fillColor || 0 === f.fillColor) && (c.globalAlpha = f.fillAlpha * d,
                c.fillStyle = "#" + ("00000" + (0 | h).toString(16)).substr(-6),
                c.fill()),
                f.lineWidth && (c.globalAlpha = f.lineAlpha * d,
                c.strokeStyle = "#" + ("00000" + (0 | i).toString(16)).substr(-6),
                c.stroke())
            }
        }
    }
    ,
    b.CanvasGraphics.renderGraphicsMask = function(a, c) {
        var d = a.graphicsData.length;
        if (0 !== d) {
            c.beginPath();
            for (var e = 0; d > e; e++) {
                var f = a.graphicsData[e]
                  , g = f.shape;
                if (f.type === b.Graphics.POLY) {
                    var h = g.points;
                    c.moveTo(h[0], h[1]);
                    for (var i = 1; i < h.length / 2; i++)
                        c.lineTo(h[2 * i], h[2 * i + 1]);
                    h[0] === h[h.length - 2] && h[1] === h[h.length - 1] && c.closePath()
                } else if (f.type === b.Graphics.RECT)
                    c.rect(g.x, g.y, g.width, g.height),
                    c.closePath();
                else if (f.type === b.Graphics.CIRC)
                    c.arc(g.x, g.y, g.radius, 0, 2 * Math.PI),
                    c.closePath();
                else if (f.type === b.Graphics.ELIP) {
                    var j = 2 * g.width
                      , k = 2 * g.height
                      , l = g.x - j / 2
                      , m = g.y - k / 2
                      , n = .5522848
                      , o = j / 2 * n
                      , p = k / 2 * n
                      , q = l + j
                      , r = m + k
                      , s = l + j / 2
                      , t = m + k / 2;
                    c.moveTo(l, t),
                    c.bezierCurveTo(l, t - p, s - o, m, s, m),
                    c.bezierCurveTo(s + o, m, q, t - p, q, t),
                    c.bezierCurveTo(q, t + p, s + o, r, s, r),
                    c.bezierCurveTo(s - o, r, l, t + p, l, t),
                    c.closePath()
                } else if (f.type === b.Graphics.RREC) {
                    var u = g.x
                      , v = g.y
                      , w = g.width
                      , x = g.height
                      , y = g.radius
                      , z = Math.min(w, x) / 2 | 0;
                    y = y > z ? z : y,
                    c.moveTo(u, v + y),
                    c.lineTo(u, v + x - y),
                    c.quadraticCurveTo(u, v + x, u + y, v + x),
                    c.lineTo(u + w - y, v + x),
                    c.quadraticCurveTo(u + w, v + x, u + w, v + x - y),
                    c.lineTo(u + w, v + y),
                    c.quadraticCurveTo(u + w, v, u + w - y, v),
                    c.lineTo(u + y, v),
                    c.quadraticCurveTo(u, v, u, v + y),
                    c.closePath()
                }
            }
        }
    }
    ,
    b.CanvasGraphics.updateGraphicsTint = function(a) {
        if (16777215 !== a.tint)
            for (var b = (a.tint >> 16 & 255) / 255, c = (a.tint >> 8 & 255) / 255, d = (255 & a.tint) / 255, e = 0; e < a.graphicsData.length; e++) {
                var f = a.graphicsData[e]
                  , g = 0 | f.fillColor
                  , h = 0 | f.lineColor;
                f._fillTint = ((g >> 16 & 255) / 255 * b * 255 << 16) + ((g >> 8 & 255) / 255 * c * 255 << 8) + (255 & g) / 255 * d * 255,
                f._lineTint = ((h >> 16 & 255) / 255 * b * 255 << 16) + ((h >> 8 & 255) / 255 * c * 255 << 8) + (255 & h) / 255 * d * 255
            }
    }
    ,
    b.BaseTextureCache = {},
    b.BaseTextureCacheIdGenerator = 0,
    b.BaseTexture = function(a, c) {
        this.resolution = 1,
        this.width = 100,
        this.height = 100,
        this.scaleMode = c || b.scaleModes.DEFAULT,
        this.hasLoaded = !1,
        this.source = a,
        this._UID = b._UID++,
        this.premultipliedAlpha = !0,
        this._glTextures = [],
        this.mipmap = !1,
        this._dirty = [!0, !0, !0, !0],
        a && ((this.source.complete || this.source.getContext) && this.source.width && this.source.height && (this.hasLoaded = !0,
        this.width = this.source.naturalWidth || this.source.width,
        this.height = this.source.naturalHeight || this.source.height,
        this.dirty()),
        this.imageUrl = null,
        this._powerOf2 = !1)
    }
    ,
    b.BaseTexture.prototype.constructor = b.BaseTexture,
    b.BaseTexture.prototype.forceLoaded = function(a, b) {
        this.hasLoaded = !0,
        this.width = a,
        this.height = b,
        this.dirty()
    }
    ,
    b.BaseTexture.prototype.destroy = function() {
        this.imageUrl ? (delete b.BaseTextureCache[this.imageUrl],
        delete b.TextureCache[this.imageUrl],
        this.imageUrl = null,
        navigator.isCocoonJS || (this.source.src = "")) : this.source && this.source._pixiId && (b.CanvasPool.removeByCanvas(this.source),
        delete b.BaseTextureCache[this.source._pixiId]),
        this.source = null,
        this.unloadFromGPU()
    }
    ,
    b.BaseTexture.prototype.updateSourceImage = function(a) {
        this.hasLoaded = !1,
        this.source.src = null,
        this.source.src = a
    }
    ,
    b.BaseTexture.prototype.dirty = function() {
        for (var a = 0; a < this._glTextures.length; a++)
            this._dirty[a] = !0
    }
    ,
    b.BaseTexture.prototype.unloadFromGPU = function() {
        this.dirty();
        for (var a = this._glTextures.length - 1; a >= 0; a--) {
            var c = this._glTextures[a]
              , d = b.glContexts[a];
            d && c && d.deleteTexture(c)
        }
        this._glTextures.length = 0,
        this.dirty()
    }
    ,
    b.BaseTexture.fromImage = function(a, c, d) {
        var e = b.BaseTextureCache[a];
        if (void 0 === c && -1 === a.indexOf("data:") && (c = !0),
        !e) {
            var f = new Image;
            c && (f.crossOrigin = ""),
            f.src = a,
            e = new b.BaseTexture(f,d),
            e.imageUrl = a,
            b.BaseTextureCache[a] = e,
            -1 !== a.indexOf(b.RETINA_PREFIX + ".") && (e.resolution = 2)
        }
        return e
    }
    ,
    b.BaseTexture.fromCanvas = function(a, c) {
        a._pixiId || (a._pixiId = "canvas_" + b.TextureCacheIdGenerator++),
        0 === a.width && (a.width = 1),
        0 === a.height && (a.height = 1);
        var d = b.BaseTextureCache[a._pixiId];
        return d || (d = new b.BaseTexture(a,c),
        b.BaseTextureCache[a._pixiId] = d),
        d
    }
    ,
    b.TextureCache = {},
    b.FrameCache = {},
    b.TextureSilentFail = !1,
    b.TextureCacheIdGenerator = 0,
    b.Texture = function(a, c, d, e) {
        this.noFrame = !1,
        c || (this.noFrame = !0,
        c = new b.Rectangle(0,0,1,1)),
        a instanceof b.Texture && (a = a.baseTexture),
        this.baseTexture = a,
        this.frame = c,
        this.trim = e,
        this.valid = !1,
        this.isTiling = !1,
        this.requiresUpdate = !1,
        this.requiresReTint = !1,
        this._uvs = null,
        this.width = 0,
        this.height = 0,
        this.crop = d || new b.Rectangle(0,0,1,1),
        a.hasLoaded && (this.noFrame && (c = new b.Rectangle(0,0,a.width,a.height)),
        this.setFrame(c))
    }
    ,
    b.Texture.prototype.constructor = b.Texture,
    b.Texture.prototype.onBaseTextureLoaded = function() {
        var a = this.baseTexture;
        this.noFrame && (this.frame = new b.Rectangle(0,0,a.width,a.height)),
        this.setFrame(this.frame)
    }
    ,
    b.Texture.prototype.destroy = function(a) {
        a && this.baseTexture.destroy(),
        this.valid = !1
    }
    ,
    b.Texture.prototype.setFrame = function(a) {
        if (this.noFrame = !1,
        this.frame = a,
        this.width = a.width,
        this.height = a.height,
        this.crop.x = a.x,
        this.crop.y = a.y,
        this.crop.width = a.width,
        this.crop.height = a.height,
        !this.trim && (a.x + a.width > this.baseTexture.width || a.y + a.height > this.baseTexture.height)) {
            if (!b.TextureSilentFail)
                throw new Error("Texture Error: frame does not fit inside the base Texture dimensions " + this);
            return void (this.valid = !1)
        }
        this.valid = a && a.width && a.height && this.baseTexture.source && this.baseTexture.hasLoaded,
        this.trim && (this.width = this.trim.width,
        this.height = this.trim.height,
        this.frame.width = this.trim.width,
        this.frame.height = this.trim.height),
        this.valid && this._updateUvs()
    }
    ,
    b.Texture.prototype._updateUvs = function() {
        this._uvs || (this._uvs = new b.TextureUvs);
        var a = this.crop
          , c = this.baseTexture.width
          , d = this.baseTexture.height;
        this._uvs.x0 = a.x / c,
        this._uvs.y0 = a.y / d,
        this._uvs.x1 = (a.x + a.width) / c,
        this._uvs.y1 = a.y / d,
        this._uvs.x2 = (a.x + a.width) / c,
        this._uvs.y2 = (a.y + a.height) / d,
        this._uvs.x3 = a.x / c,
        this._uvs.y3 = (a.y + a.height) / d
    }
    ,
    b.Texture.fromImage = function(a, c, d) {
        var e = b.TextureCache[a];
        return e || (e = new b.Texture(b.BaseTexture.fromImage(a, c, d)),
        b.TextureCache[a] = e),
        e
    }
    ,
    b.Texture.fromFrame = function(a) {
        var c = b.TextureCache[a];
        if (!c)
            throw new Error('The frameId "' + a + '" does not exist in the texture cache ');
        return c
    }
    ,
    b.Texture.fromCanvas = function(a, c) {
        var d = b.BaseTexture.fromCanvas(a, c);
        return new b.Texture(d)
    }
    ,
    b.Texture.addTextureToCache = function(a, c) {
        b.TextureCache[c] = a
    }
    ,
    b.Texture.removeTextureFromCache = function(a) {
        var c = b.TextureCache[a];
        return delete b.TextureCache[a],
        delete b.BaseTextureCache[a],
        c
    }
    ,
    b.TextureUvs = function() {
        this.x0 = 0,
        this.y0 = 0,
        this.x1 = 0,
        this.y1 = 0,
        this.x2 = 0,
        this.y2 = 0,
        this.x3 = 0,
        this.y3 = 0
    }
    ,
    b.RenderTexture = function(a, c, d, e, f) {
        if (this.width = a || 100,
        this.height = c || 100,
        this.resolution = f || 1,
        this.frame = new b.Rectangle(0,0,this.width * this.resolution,this.height * this.resolution),
        this.crop = new b.Rectangle(0,0,this.width * this.resolution,this.height * this.resolution),
        this.baseTexture = new b.BaseTexture,
        this.baseTexture.width = this.width * this.resolution,
        this.baseTexture.height = this.height * this.resolution,
        this.baseTexture._glTextures = [],
        this.baseTexture.resolution = this.resolution,
        this.baseTexture.scaleMode = e || b.scaleModes.DEFAULT,
        this.baseTexture.hasLoaded = !0,
        b.Texture.call(this, this.baseTexture, new b.Rectangle(0,0,this.width * this.resolution,this.height * this.resolution)),
        this.renderer = d || b.defaultRenderer,
        this.renderer.type === b.WEBGL_RENDERER) {
            var g = this.renderer.gl;
            this.baseTexture._dirty[g.id] = !1,
            this.textureBuffer = new b.FilterTexture(g,this.width,this.height,this.baseTexture.scaleMode),
            this.baseTexture._glTextures[g.id] = this.textureBuffer.texture,
            this.render = this.renderWebGL,
            this.projection = new b.Point(.5 * this.width,.5 * -this.height)
        } else
            this.render = this.renderCanvas,
            this.textureBuffer = new b.CanvasBuffer(this.width * this.resolution,this.height * this.resolution),
            this.baseTexture.source = this.textureBuffer.canvas;
        this.valid = !0,
        this.tempMatrix = new Phaser.Matrix,
        this._updateUvs()
    }
    ,
    b.RenderTexture.prototype = Object.create(b.Texture.prototype),
    b.RenderTexture.prototype.constructor = b.RenderTexture,
    b.RenderTexture.prototype.resize = function(a, c, d) {
        (a !== this.width || c !== this.height) && (this.valid = a > 0 && c > 0,
        this.width = a,
        this.height = c,
        this.frame.width = this.crop.width = a * this.resolution,
        this.frame.height = this.crop.height = c * this.resolution,
        d && (this.baseTexture.width = this.width * this.resolution,
        this.baseTexture.height = this.height * this.resolution),
        this.renderer.type === b.WEBGL_RENDERER && (this.projection.x = this.width / 2,
        this.projection.y = -this.height / 2),
        this.valid && this.textureBuffer.resize(this.width, this.height))
    }
    ,
    b.RenderTexture.prototype.clear = function() {
        this.valid && (this.renderer.type === b.WEBGL_RENDERER && this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, this.textureBuffer.frameBuffer),
        this.textureBuffer.clear())
    }
    ,
    b.RenderTexture.prototype.renderWebGL = function(a, b, c) {
        if (this.valid && 0 !== a.alpha) {
            var d = a.worldTransform;
            d.identity(),
            d.translate(0, 2 * this.projection.y),
            b && d.append(b),
            d.scale(1, -1);
            for (var e = 0; e < a.children.length; e++)
                a.children[e].updateTransform();
            var f = this.renderer.gl;
            f.viewport(0, 0, this.width * this.resolution, this.height * this.resolution),
            f.bindFramebuffer(f.FRAMEBUFFER, this.textureBuffer.frameBuffer),
            c && this.textureBuffer.clear(),
            this.renderer.spriteBatch.dirty = !0,
            this.renderer.renderDisplayObject(a, this.projection, this.textureBuffer.frameBuffer, b),
            this.renderer.spriteBatch.dirty = !0
        }
    }
    ,
    b.RenderTexture.prototype.renderCanvas = function(a, b, c) {
        if (this.valid && 0 !== a.alpha) {
            var d = a.worldTransform;
            d.identity(),
            b && d.append(b);
            for (var e = 0; e < a.children.length; e++)
                a.children[e].updateTransform();
            c && this.textureBuffer.clear();
            var f = this.renderer.resolution;
            this.renderer.resolution = this.resolution,
            this.renderer.renderDisplayObject(a, this.textureBuffer.context, b),
            this.renderer.resolution = f
        }
    }
    ,
    b.RenderTexture.prototype.getImage = function() {
        var a = new Image;
        return a.src = this.getBase64(),
        a
    }
    ,
    b.RenderTexture.prototype.getBase64 = function() {
        return this.getCanvas().toDataURL()
    }
    ,
    b.RenderTexture.prototype.getCanvas = function() {
        if (this.renderer.type === b.WEBGL_RENDERER) {
            var a = this.renderer.gl
              , c = this.textureBuffer.width
              , d = this.textureBuffer.height
              , e = new Uint8Array(4 * c * d);
            a.bindFramebuffer(a.FRAMEBUFFER, this.textureBuffer.frameBuffer),
            a.readPixels(0, 0, c, d, a.RGBA, a.UNSIGNED_BYTE, e),
            a.bindFramebuffer(a.FRAMEBUFFER, null);
            var f = new b.CanvasBuffer(c,d)
              , g = f.context.getImageData(0, 0, c, d);
            return g.data.set(e),
            f.context.putImageData(g, 0, 0),
            f.canvas
        }
        return this.textureBuffer.canvas
    }
    ,
    b.AbstractFilter = function(a, b) {
        this.passes = [this],
        this.shaders = [],
        this.dirty = !0,
        this.padding = 0,
        this.uniforms = b || {},
        this.fragmentSrc = a || []
    }
    ,
    b.AbstractFilter.prototype.constructor = b.AbstractFilter,
    b.AbstractFilter.prototype.syncUniforms = function() {
        for (var a = 0, b = this.shaders.length; b > a; a++)
            this.shaders[a].dirty = !0
    }
    ,
    b.Strip = function(a) {
        b.DisplayObjectContainer.call(this),
        this.texture = a,
        this.uvs = new b.Float32Array([0, 1, 1, 1, 1, 0, 0, 1]),
        this.vertices = new b.Float32Array([0, 0, 100, 0, 100, 100, 0, 100]),
        this.colors = new b.Float32Array([1, 1, 1, 1]),
        this.indices = new b.Uint16Array([0, 1, 2, 3]),
        this.dirty = !0,
        this.blendMode = b.blendModes.NORMAL,
        this.canvasPadding = 0,
        this.drawMode = b.Strip.DrawModes.TRIANGLE_STRIP
    }
    ,
    b.Strip.prototype = Object.create(b.DisplayObjectContainer.prototype),
    b.Strip.prototype.constructor = b.Strip,
    b.Strip.prototype._renderWebGL = function(a) {
        !this.visible || this.alpha <= 0 || (a.spriteBatch.stop(),
        this._vertexBuffer || this._initWebGL(a),
        a.shaderManager.setShader(a.shaderManager.stripShader),
        this._renderStrip(a),
        a.spriteBatch.start())
    }
    ,
    b.Strip.prototype._initWebGL = function(a) {
        var b = a.gl;
        this._vertexBuffer = b.createBuffer(),
        this._indexBuffer = b.createBuffer(),
        this._uvBuffer = b.createBuffer(),
        this._colorBuffer = b.createBuffer(),
        b.bindBuffer(b.ARRAY_BUFFER, this._vertexBuffer),
        b.bufferData(b.ARRAY_BUFFER, this.vertices, b.DYNAMIC_DRAW),
        b.bindBuffer(b.ARRAY_BUFFER, this._uvBuffer),
        b.bufferData(b.ARRAY_BUFFER, this.uvs, b.STATIC_DRAW),
        b.bindBuffer(b.ARRAY_BUFFER, this._colorBuffer),
        b.bufferData(b.ARRAY_BUFFER, this.colors, b.STATIC_DRAW),
        b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, this._indexBuffer),
        b.bufferData(b.ELEMENT_ARRAY_BUFFER, this.indices, b.STATIC_DRAW)
    }
    ,
    b.Strip.prototype._renderStrip = function(a) {
        var c = a.gl
          , d = a.projection
          , e = a.offset
          , f = a.shaderManager.stripShader
          , g = this.drawMode === b.Strip.DrawModes.TRIANGLE_STRIP ? c.TRIANGLE_STRIP : c.TRIANGLES;
        a.blendModeManager.setBlendMode(this.blendMode),
        c.uniformMatrix3fv(f.translationMatrix, !1, this.worldTransform.toArray(!0)),
        c.uniform2f(f.projectionVector, d.x, -d.y),
        c.uniform2f(f.offsetVector, -e.x, -e.y),
        c.uniform1f(f.alpha, this.worldAlpha),
        this.dirty ? (this.dirty = !1,
        c.bindBuffer(c.ARRAY_BUFFER, this._vertexBuffer),
        c.bufferData(c.ARRAY_BUFFER, this.vertices, c.STATIC_DRAW),
        c.vertexAttribPointer(f.aVertexPosition, 2, c.FLOAT, !1, 0, 0),
        c.bindBuffer(c.ARRAY_BUFFER, this._uvBuffer),
        c.bufferData(c.ARRAY_BUFFER, this.uvs, c.STATIC_DRAW),
        c.vertexAttribPointer(f.aTextureCoord, 2, c.FLOAT, !1, 0, 0),
        c.activeTexture(c.TEXTURE0),
        this.texture.baseTexture._dirty[c.id] ? a.renderer.updateTexture(this.texture.baseTexture) : c.bindTexture(c.TEXTURE_2D, this.texture.baseTexture._glTextures[c.id]),
        c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, this._indexBuffer),
        c.bufferData(c.ELEMENT_ARRAY_BUFFER, this.indices, c.STATIC_DRAW)) : (c.bindBuffer(c.ARRAY_BUFFER, this._vertexBuffer),
        c.bufferSubData(c.ARRAY_BUFFER, 0, this.vertices),
        c.vertexAttribPointer(f.aVertexPosition, 2, c.FLOAT, !1, 0, 0),
        c.bindBuffer(c.ARRAY_BUFFER, this._uvBuffer),
        c.vertexAttribPointer(f.aTextureCoord, 2, c.FLOAT, !1, 0, 0),
        c.activeTexture(c.TEXTURE0),
        this.texture.baseTexture._dirty[c.id] ? a.renderer.updateTexture(this.texture.baseTexture) : c.bindTexture(c.TEXTURE_2D, this.texture.baseTexture._glTextures[c.id]),
        c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, this._indexBuffer)),
        c.drawElements(g, this.indices.length, c.UNSIGNED_SHORT, 0)
    }
    ,
    b.Strip.prototype._renderCanvas = function(a) {
        var c = a.context
          , d = this.worldTransform;
        a.roundPixels ? c.setTransform(d.a, d.b, d.c, d.d, 0 | d.tx, 0 | d.ty) : c.setTransform(d.a, d.b, d.c, d.d, d.tx, d.ty),
        this.drawMode === b.Strip.DrawModes.TRIANGLE_STRIP ? this._renderCanvasTriangleStrip(c) : this._renderCanvasTriangles(c)
    }
    ,
    b.Strip.prototype._renderCanvasTriangleStrip = function(a) {
        var b = this.vertices
          , c = this.uvs
          , d = b.length / 2;
        this.count++;
        for (var e = 0; d - 2 > e; e++) {
            var f = 2 * e;
            this._renderCanvasDrawTriangle(a, b, c, f, f + 2, f + 4)
        }
    }
    ,
    b.Strip.prototype._renderCanvasTriangles = function(a) {
        var b = this.vertices
          , c = this.uvs
          , d = this.indices
          , e = d.length;
        this.count++;
        for (var f = 0; e > f; f += 3) {
            var g = 2 * d[f]
              , h = 2 * d[f + 1]
              , i = 2 * d[f + 2];
            this._renderCanvasDrawTriangle(a, b, c, g, h, i)
        }
    }
    ,
    b.Strip.prototype._renderCanvasDrawTriangle = function(a, b, c, d, e, f) {
        var g = this.texture.baseTexture.source
          , h = this.texture.width
          , i = this.texture.height
          , j = b[d]
          , k = b[e]
          , l = b[f]
          , m = b[d + 1]
          , n = b[e + 1]
          , o = b[f + 1]
          , p = c[d] * h
          , q = c[e] * h
          , r = c[f] * h
          , s = c[d + 1] * i
          , t = c[e + 1] * i
          , u = c[f + 1] * i;
        if (this.canvasPadding > 0) {
            var v = this.canvasPadding / this.worldTransform.a
              , w = this.canvasPadding / this.worldTransform.d
              , x = (j + k + l) / 3
              , y = (m + n + o) / 3
              , z = j - x
              , A = m - y
              , B = Math.sqrt(z * z + A * A);
            j = x + z / B * (B + v),
            m = y + A / B * (B + w),
            z = k - x,
            A = n - y,
            B = Math.sqrt(z * z + A * A),
            k = x + z / B * (B + v),
            n = y + A / B * (B + w),
            z = l - x,
            A = o - y,
            B = Math.sqrt(z * z + A * A),
            l = x + z / B * (B + v),
            o = y + A / B * (B + w)
        }
        a.save(),
        a.beginPath(),
        a.moveTo(j, m),
        a.lineTo(k, n),
        a.lineTo(l, o),
        a.closePath(),
        a.clip();
        var C = p * t + s * r + q * u - t * r - s * q - p * u
          , D = j * t + s * l + k * u - t * l - s * k - j * u
          , E = p * k + j * r + q * l - k * r - j * q - p * l
          , F = p * t * l + s * k * r + j * q * u - j * t * r - s * q * l - p * k * u
          , G = m * t + s * o + n * u - t * o - s * n - m * u
          , H = p * n + m * r + q * o - n * r - m * q - p * o
          , I = p * t * o + s * n * r + m * q * u - m * t * r - s * q * o - p * n * u;
        a.transform(D / C, G / C, E / C, H / C, F / C, I / C),
        a.drawImage(g, 0, 0),
        a.restore()
    }
    ,
    b.Strip.prototype.renderStripFlat = function(a) {
        var b = this.context
          , c = a.vertices
          , d = c.length / 2;
        this.count++,
        b.beginPath();
        for (var e = 1; d - 2 > e; e++) {
            var f = 2 * e
              , g = c[f]
              , h = c[f + 2]
              , i = c[f + 4]
              , j = c[f + 1]
              , k = c[f + 3]
              , l = c[f + 5];
            b.moveTo(g, j),
            b.lineTo(h, k),
            b.lineTo(i, l)
        }
        b.fillStyle = "#FF0000",
        b.fill(),
        b.closePath()
    }
    ,
    b.Strip.prototype.onTextureUpdate = function() {
        this.updateFrame = !0
    }
    ,
    b.Strip.prototype.getBounds = function(a) {
        for (var c = a || this.worldTransform, d = c.a, e = c.b, f = c.c, g = c.d, h = c.tx, i = c.ty, j = -1 / 0, k = -1 / 0, l = 1 / 0, m = 1 / 0, n = this.vertices, o = 0, p = n.length; p > o; o += 2) {
            var q = n[o]
              , r = n[o + 1]
              , s = d * q + f * r + h
              , t = g * r + e * q + i;
            l = l > s ? s : l,
            m = m > t ? t : m,
            j = s > j ? s : j,
            k = t > k ? t : k
        }
        if (l === -1 / 0 || 1 / 0 === k)
            return b.EmptyRectangle;
        var u = this._bounds;
        return u.x = l,
        u.width = j - l,
        u.y = m,
        u.height = k - m,
        this._currentBounds = u,
        u
    }
    ,
    b.Strip.DrawModes = {
        TRIANGLE_STRIP: 0,
        TRIANGLES: 1
    },
    b.Rope = function(a, c) {
        b.Strip.call(this, a),
        this.points = c,
        this.vertices = new b.Float32Array(4 * c.length),
        this.uvs = new b.Float32Array(4 * c.length),
        this.colors = new b.Float32Array(2 * c.length),
        this.indices = new b.Uint16Array(2 * c.length),
        this.refresh()
    }
    ,
    b.Rope.prototype = Object.create(b.Strip.prototype),
    b.Rope.prototype.constructor = b.Rope,
    b.Rope.prototype.refresh = function() {
        var a = this.points;
        if (!(a.length < 1)) {
            var b = this.uvs
              , c = a[0]
              , d = this.indices
              , e = this.colors;
            this.count -= .2,
            b[0] = 0,
            b[1] = 0,
            b[2] = 0,
            b[3] = 1,
            e[0] = 1,
            e[1] = 1,
            d[0] = 0,
            d[1] = 1;
            for (var f, g, h, i = a.length, j = 1; i > j; j++)
                f = a[j],
                g = 4 * j,
                h = j / (i - 1),
                j % 2 ? (b[g] = h,
                b[g + 1] = 0,
                b[g + 2] = h,
                b[g + 3] = 1) : (b[g] = h,
                b[g + 1] = 0,
                b[g + 2] = h,
                b[g + 3] = 1),
                g = 2 * j,
                e[g] = 1,
                e[g + 1] = 1,
                g = 2 * j,
                d[g] = g,
                d[g + 1] = g + 1,
                c = f
        }
    }
    ,
    b.Rope.prototype.updateTransform = function() {
        var a = this.points;
        if (!(a.length < 1)) {
            var c, d = a[0], e = {
                x: 0,
                y: 0
            };
            this.count -= .2;
            for (var f, g, h, i, j, k = this.vertices, l = a.length, m = 0; l > m; m++)
                f = a[m],
                g = 4 * m,
                c = m < a.length - 1 ? a[m + 1] : f,
                e.y = -(c.x - d.x),
                e.x = c.y - d.y,
                h = 10 * (1 - m / (l - 1)),
                h > 1 && (h = 1),
                i = Math.sqrt(e.x * e.x + e.y * e.y),
                j = this.texture.height / 2,
                e.x /= i,
                e.y /= i,
                e.x *= j,
                e.y *= j,
                k[g] = f.x + e.x,
                k[g + 1] = f.y + e.y,
                k[g + 2] = f.x - e.x,
                k[g + 3] = f.y - e.y,
                d = f;
            b.DisplayObjectContainer.prototype.updateTransform.call(this)
        }
    }
    ,
    b.Rope.prototype.setTexture = function(a) {
        this.texture = a
    }
    ,
    b.TilingSprite = function(a, c, d) {
        b.Sprite.call(this, a),
        this._width = c || 128,
        this._height = d || 128,
        this.tileScale = new b.Point(1,1),
        this.tileScaleOffset = new b.Point(1,1),
        this.tilePosition = new b.Point,
        this.renderable = !0,
        this.tint = 16777215,
        this.textureDebug = !1,
        this.blendMode = b.blendModes.NORMAL,
        this.canvasBuffer = null,
        this.tilingTexture = null,
        this.tilePattern = null,
        this.refreshTexture = !0,
        this.frameWidth = 0,
        this.frameHeight = 0
    }
    ,
    b.TilingSprite.prototype = Object.create(b.Sprite.prototype),
    b.TilingSprite.prototype.constructor = b.TilingSprite,
    b.TilingSprite.prototype.setTexture = function(a) {
        this.texture !== a && (this.texture = a,
        this.refreshTexture = !0,
        this.cachedTint = 16777215)
    }
    ,
    b.TilingSprite.prototype._renderWebGL = function(a) {
        if (this.visible !== !1 && 0 !== this.alpha) {
            if (this._mask && (a.spriteBatch.stop(),
            a.maskManager.pushMask(this.mask, a),
            a.spriteBatch.start()),
            this._filters && (a.spriteBatch.flush(),
            a.filterManager.pushFilter(this._filterBlock)),
            this.refreshTexture) {
                if (this.generateTilingTexture(!0),
                !this.tilingTexture)
                    return;
                this.tilingTexture.needsUpdate && (a.renderer.updateTexture(this.tilingTexture.baseTexture),
                this.tilingTexture.needsUpdate = !1)
            }
            a.spriteBatch.renderTilingSprite(this);
            for (var b = 0; b < this.children.length; b++)
                this.children[b]._renderWebGL(a);
            a.spriteBatch.stop(),
            this._filters && a.filterManager.popFilter(),
            this._mask && a.maskManager.popMask(this._mask, a),
            a.spriteBatch.start()
        }
    }
    ,
    b.TilingSprite.prototype._renderCanvas = function(a) {
        if (this.visible !== !1 && 0 !== this.alpha) {
            var c = a.context;
            this._mask && a.maskManager.pushMask(this._mask, a),
            c.globalAlpha = this.worldAlpha;
            var d = this.worldTransform
              , e = a.resolution;
            if (c.setTransform(d.a * e, d.b * e, d.c * e, d.d * e, d.tx * e, d.ty * e),
            this.refreshTexture) {
                if (this.generateTilingTexture(!1),
                !this.tilingTexture)
                    return;
                this.tilePattern = c.createPattern(this.tilingTexture.baseTexture.source, "repeat")
            }
            var f = a.currentBlendMode;
            this.blendMode !== a.currentBlendMode && (a.currentBlendMode = this.blendMode,
            c.globalCompositeOperation = b.blendModesCanvas[a.currentBlendMode]);
            var g = this.tilePosition
              , h = this.tileScale;
            g.x %= this.tilingTexture.baseTexture.width,
            g.y %= this.tilingTexture.baseTexture.height,
            c.scale(h.x, h.y),
            c.translate(g.x + this.anchor.x * -this._width, g.y + this.anchor.y * -this._height),
            c.fillStyle = this.tilePattern;
            var i = -g.x
              , j = -g.y
              , k = this._width / h.x
              , l = this._height / h.y;
            a.roundPixels && (i |= 0,
            j |= 0,
            k |= 0,
            l |= 0),
            c.fillRect(i, j, k, l),
            c.scale(1 / h.x, 1 / h.y),
            c.translate(-g.x + this.anchor.x * this._width, -g.y + this.anchor.y * this._height),
            this._mask && a.maskManager.popMask(a);
            for (var m = 0; m < this.children.length; m++)
                this.children[m]._renderCanvas(a);
            f !== this.blendMode && (a.currentBlendMode = f,
            c.globalCompositeOperation = b.blendModesCanvas[f])
        }
    }
    ,
    b.TilingSprite.prototype.onTextureUpdate = function() {}
    ,
    b.TilingSprite.prototype.generateTilingTexture = function(a) {
        if (this.texture.baseTexture.hasLoaded) {
            var c = this.texture
              , d = c.frame
              , e = this._frame.sourceSizeW
              , f = this._frame.sourceSizeH
              , g = 0
              , h = 0;
            this._frame.trimmed && (g = this._frame.spriteSourceSizeX,
            h = this._frame.spriteSourceSizeY),
            a && (e = b.getNextPowerOfTwo(e),
            f = b.getNextPowerOfTwo(f)),
            this.canvasBuffer ? (this.canvasBuffer.resize(e, f),
            this.tilingTexture.baseTexture.width = e,
            this.tilingTexture.baseTexture.height = f,
            this.tilingTexture.needsUpdate = !0) : (this.canvasBuffer = new b.CanvasBuffer(e,f),
            this.tilingTexture = b.Texture.fromCanvas(this.canvasBuffer.canvas),
            this.tilingTexture = b.Texture.fromCanvas(this.canvasBuffer.canvas),
            this.tilingTexture.isTiling = !0,
            this.tilingTexture.needsUpdate = !0),
            this.textureDebug && (this.canvasBuffer.context.strokeStyle = "#00ff00",
            this.canvasBuffer.context.strokeRect(0, 0, e, f));
            var i = c.crop.width
              , j = c.crop.height;
            (i !== e || j !== f) && (i = e,
            j = f),
            this.canvasBuffer.context.drawImage(c.baseTexture.source, c.crop.x, c.crop.y, c.crop.width, c.crop.height, g, h, i, j),
            this.tileScaleOffset.x = d.width / e,
            this.tileScaleOffset.y = d.height / f,
            this.refreshTexture = !1,
            this.tilingTexture.baseTexture._powerOf2 = !0
        }
    }
    ,
    b.TilingSprite.prototype.getBounds = function() {
        var a = this._width
          , b = this._height
          , c = a * (1 - this.anchor.x)
          , d = a * -this.anchor.x
          , e = b * (1 - this.anchor.y)
          , f = b * -this.anchor.y
          , g = this.worldTransform
          , h = g.a
          , i = g.b
          , j = g.c
          , k = g.d
          , l = g.tx
          , m = g.ty
          , n = h * d + j * f + l
          , o = k * f + i * d + m
          , p = h * c + j * f + l
          , q = k * f + i * c + m
          , r = h * c + j * e + l
          , s = k * e + i * c + m
          , t = h * d + j * e + l
          , u = k * e + i * d + m
          , v = -1 / 0
          , w = -1 / 0
          , x = 1 / 0
          , y = 1 / 0;
        x = x > n ? n : x,
        x = x > p ? p : x,
        x = x > r ? r : x,
        x = x > t ? t : x,
        y = y > o ? o : y,
        y = y > q ? q : y,
        y = y > s ? s : y,
        y = y > u ? u : y,
        v = n > v ? n : v,
        v = p > v ? p : v,
        v = r > v ? r : v,
        v = t > v ? t : v,
        w = o > w ? o : w,
        w = q > w ? q : w,
        w = s > w ? s : w,
        w = u > w ? u : w;
        var z = this._bounds;
        return z.x = x,
        z.width = v - x,
        z.y = y,
        z.height = w - y,
        this._currentBounds = z,
        z
    }
    ,
    b.TilingSprite.prototype.destroy = function() {
        this.canvasBuffer.destroy(),
        b.Sprite.prototype.destroy.call(this),
        this.tileScale = null,
        this.tileScaleOffset = null,
        this.tilePosition = null,
        this.tilingTexture && (this.tilingTexture.destroy(!0),
        this.tilingTexture = null)
    }
    ,
    Object.defineProperty(b.TilingSprite.prototype, "width", {
        get: function() {
            return this._width
        },
        set: function(a) {
            this._width = a
        }
    }),
    Object.defineProperty(b.TilingSprite.prototype, "height", {
        get: function() {
            return this._height
        },
        set: function(a) {
            this._height = a
        }
    }),
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = b),
    exports.PIXI = b) : "undefined" != typeof define && define.amd ? define("PIXI", function() {
        return a.PIXI = b
    }()) : a.PIXI = b,
    b
}
).call(this),
function() {
    function a(a, b) {
        this._scaleFactor = a,
        this._deltaMode = b,
        this.originalEvent = null
    }
    var b = this
      , c = c || {
        VERSION: "2.4.3",
        GAMES: [],
        AUTO: 0,
        CANVAS: 1,
        WEBGL: 2,
        HEADLESS: 3,
        NONE: 0,
        LEFT: 1,
        RIGHT: 2,
        UP: 3,
        DOWN: 4,
        SPRITE: 0,
        BUTTON: 1,
        IMAGE: 2,
        GRAPHICS: 3,
        TEXT: 4,
        TILESPRITE: 5,
        BITMAPTEXT: 6,
        GROUP: 7,
        RENDERTEXTURE: 8,
        TILEMAP: 9,
        TILEMAPLAYER: 10,
        EMITTER: 11,
        POLYGON: 12,
        BITMAPDATA: 13,
        CANVAS_FILTER: 14,
        WEBGL_FILTER: 15,
        ELLIPSE: 16,
        SPRITEBATCH: 17,
        RETROFONT: 18,
        POINTER: 19,
        ROPE: 20,
        CIRCLE: 21,
        RECTANGLE: 22,
        LINE: 23,
        MATRIX: 24,
        POINT: 25,
        ROUNDEDRECTANGLE: 26,
        CREATURE: 27,
        VIDEO: 28,
        blendModes: {
            NORMAL: 0,
            ADD: 1,
            MULTIPLY: 2,
            SCREEN: 3,
            OVERLAY: 4,
            DARKEN: 5,
            LIGHTEN: 6,
            COLOR_DODGE: 7,
            COLOR_BURN: 8,
            HARD_LIGHT: 9,
            SOFT_LIGHT: 10,
            DIFFERENCE: 11,
            EXCLUSION: 12,
            HUE: 13,
            SATURATION: 14,
            COLOR: 15,
            LUMINOSITY: 16
        },
        scaleModes: {
            DEFAULT: 0,
            LINEAR: 0,
            NEAREST: 1
        },
        PIXI: PIXI || {}
    };
    if (Math.trunc || (Math.trunc = function(a) {
        return 0 > a ? Math.ceil(a) : Math.floor(a)
    }
    ),
    Function.prototype.bind || (Function.prototype.bind = function() {
        var a = Array.prototype.slice;
        return function(b) {
            function c() {
                var f = e.concat(a.call(arguments));
                d.apply(this instanceof c ? this : b, f)
            }
            var d = this
              , e = a.call(arguments, 1);
            if ("function" != typeof d)
                throw new TypeError;
            return c.prototype = function f(a) {
                return a && (f.prototype = a),
                this instanceof f ? void 0 : new f
            }(d.prototype),
            c
        }
    }()),
    Array.isArray || (Array.isArray = function(a) {
        return "[object Array]" == Object.prototype.toString.call(a)
    }
    ),
    Array.prototype.forEach || (Array.prototype.forEach = function(a) {
        "use strict";
        if (void 0 === this || null === this)
            throw new TypeError;
        var b = Object(this)
          , c = b.length >>> 0;
        if ("function" != typeof a)
            throw new TypeError;
        for (var d = arguments.length >= 2 ? arguments[1] : void 0, e = 0; c > e; e++)
            e in b && a.call(d, b[e], e, b)
    }
    ),
    "function" != typeof window.Uint32Array && "object" != typeof window.Uint32Array) {
        var d = function(a) {
            var b = new Array;
            window[a] = function(a) {
                if ("number" == typeof a) {
                    Array.call(this, a),
                    this.length = a;
                    for (var b = 0; b < this.length; b++)
                        this[b] = 0
                } else {
                    Array.call(this, a.length),
                    this.length = a.length;
                    for (var b = 0; b < this.length; b++)
                        this[b] = a[b]
                }
            }
            ,
            window[a].prototype = b,
            window[a].constructor = window[a]
        };
        d("Uint32Array"),
        d("Int16Array")
    }
    window.console || (window.console = {},
    window.console.log = window.console.assert = function() {}
    ,
    window.console.warn = window.console.assert = function() {}
    ),
    c.Utils = {
        getProperty: function(a, b) {
            for (var c = b.split("."), d = c.pop(), e = c.length, f = 1, g = c[0]; e > f && (a = a[g]); )
                g = c[f],
                f++;
            return a ? a[d] : null
        },
        setProperty: function(a, b, c) {
            for (var d = b.split("."), e = d.pop(), f = d.length, g = 1, h = d[0]; f > g && (a = a[h]); )
                h = d[g],
                g++;
            return a && (a[e] = c),
            a
        },
        chanceRoll: function(a) {
            return void 0 === a && (a = 50),
            a > 0 && 100 * Math.random() <= a
        },
        randomChoice: function(a, b) {
            return Math.random() < .5 ? a : b
        },
        parseDimension: function(a, b) {
            var c = 0
              , d = 0;
            return "string" == typeof a ? "%" === a.substr(-1) ? (c = parseInt(a, 10) / 100,
            d = 0 === b ? window.innerWidth * c : window.innerHeight * c) : d = parseInt(a, 10) : d = a,
            d
        },
        pad: function(a, b, c, d) {
            if (void 0 === b)
                var b = 0;
            if (void 0 === c)
                var c = " ";
            if (void 0 === d)
                var d = 3;
            var e = 0;
            if (b + 1 >= a.length)
                switch (d) {
                case 1:
                    a = new Array(b + 1 - a.length).join(c) + a;
                    break;
                case 3:
                    var f = Math.ceil((e = b - a.length) / 2)
                      , g = e - f;
                    a = new Array(g + 1).join(c) + a + new Array(f + 1).join(c);
                    break;
                default:
                    a += new Array(b + 1 - a.length).join(c)
                }
            return a
        },
        isPlainObject: function(a) {
            if ("object" != typeof a || a.nodeType || a === a.window)
                return !1;
            try {
                if (a.constructor && !{}.hasOwnProperty.call(a.constructor.prototype, "isPrototypeOf"))
                    return !1
            } catch (b) {
                return !1
            }
            return !0
        },
        extend: function() {
            var a, b, d, e, f, g, h = arguments[0] || {}, i = 1, j = arguments.length, k = !1;
            for ("boolean" == typeof h && (k = h,
            h = arguments[1] || {},
            i = 2),
            j === i && (h = this,
            --i); j > i; i++)
                if (null != (a = arguments[i]))
                    for (b in a)
                        d = h[b],
                        e = a[b],
                        h !== e && (k && e && (c.Utils.isPlainObject(e) || (f = Array.isArray(e))) ? (f ? (f = !1,
                        g = d && Array.isArray(d) ? d : []) : g = d && c.Utils.isPlainObject(d) ? d : {},
                        h[b] = c.Utils.extend(k, g, e)) : void 0 !== e && (h[b] = e));
            return h
        },
        mixinPrototype: function(a, b, c) {
            void 0 === c && (c = !1);
            for (var d = Object.keys(b), e = 0; e < d.length; e++) {
                var f = d[e]
                  , g = b[f];
                !c && f in a || (!g || "function" != typeof g.get && "function" != typeof g.set ? a[f] = g : "function" == typeof g.clone ? a[f] = g.clone() : Object.defineProperty(a, f, g))
            }
        },
        mixin: function(a, b) {
            if (!a || "object" != typeof a)
                return b;
            for (var d in a) {
                var e = a[d];
                if (!e.childNodes && !e.cloneNode) {
                    var f = typeof a[d];
                    b[d] = a[d] && "object" === f ? typeof b[d] === f ? c.Utils.mixin(a[d], b[d]) : c.Utils.mixin(a[d], new e.constructor) : a[d]
                }
            }
            return b
        }
    },
    c.Circle = function(a, b, d) {
        a = a || 0,
        b = b || 0,
        d = d || 0,
        this.x = a,
        this.y = b,
        this._diameter = d,
        this._radius = 0,
        d > 0 && (this._radius = .5 * d),
        this.type = c.CIRCLE
    }
    ,
    c.Circle.prototype = {
        circumference: function() {
            return 2 * Math.PI * this._radius
        },
        random: function(a) {
            void 0 === a && (a = new c.Point);
            var b = 2 * Math.PI * Math.random()
              , d = Math.random() + Math.random()
              , e = d > 1 ? 2 - d : d
              , f = e * Math.cos(b)
              , g = e * Math.sin(b);
            return a.x = this.x + f * this.radius,
            a.y = this.y + g * this.radius,
            a
        },
        getBounds: function() {
            return new c.Rectangle(this.x - this.radius,this.y - this.radius,this.diameter,this.diameter)
        },
        setTo: function(a, b, c) {
            return this.x = a,
            this.y = b,
            this._diameter = c,
            this._radius = .5 * c,
            this
        },
        copyFrom: function(a) {
            return this.setTo(a.x, a.y, a.diameter)
        },
        copyTo: function(a) {
            return a.x = this.x,
            a.y = this.y,
            a.diameter = this._diameter,
            a
        },
        distance: function(a, b) {
            var d = c.Math.distance(this.x, this.y, a.x, a.y);
            return b ? Math.round(d) : d
        },
        clone: function(a) {
            return void 0 === a || null === a ? a = new c.Circle(this.x,this.y,this.diameter) : a.setTo(this.x, this.y, this.diameter),
            a
        },
        contains: function(a, b) {
            return c.Circle.contains(this, a, b)
        },
        circumferencePoint: function(a, b, d) {
            return c.Circle.circumferencePoint(this, a, b, d)
        },
        offset: function(a, b) {
            return this.x += a,
            this.y += b,
            this
        },
        offsetPoint: function(a) {
            return this.offset(a.x, a.y)
        },
        toString: function() {
            return "[{Phaser.Circle (x=" + this.x + " y=" + this.y + " diameter=" + this.diameter + " radius=" + this.radius + ")}]"
        }
    },
    c.Circle.prototype.constructor = c.Circle,
    Object.defineProperty(c.Circle.prototype, "diameter", {
        get: function() {
            return this._diameter
        },
        set: function(a) {
            a > 0 && (this._diameter = a,
            this._radius = .5 * a)
        }
    }),
    Object.defineProperty(c.Circle.prototype, "radius", {
        get: function() {
            return this._radius
        },
        set: function(a) {
            a > 0 && (this._radius = a,
            this._diameter = 2 * a)
        }
    }),
    Object.defineProperty(c.Circle.prototype, "left", {
        get: function() {
            return this.x - this._radius
        },
        set: function(a) {
            a > this.x ? (this._radius = 0,
            this._diameter = 0) : this.radius = this.x - a
        }
    }),
    Object.defineProperty(c.Circle.prototype, "right", {
        get: function() {
            return this.x + this._radius
        },
        set: function(a) {
            a < this.x ? (this._radius = 0,
            this._diameter = 0) : this.radius = a - this.x
        }
    }),
    Object.defineProperty(c.Circle.prototype, "top", {
        get: function() {
            return this.y - this._radius
        },
        set: function(a) {
            a > this.y ? (this._radius = 0,
            this._diameter = 0) : this.radius = this.y - a
        }
    }),
    Object.defineProperty(c.Circle.prototype, "bottom", {
        get: function() {
            return this.y + this._radius
        },
        set: function(a) {
            a < this.y ? (this._radius = 0,
            this._diameter = 0) : this.radius = a - this.y
        }
    }),
    Object.defineProperty(c.Circle.prototype, "area", {
        get: function() {
            return this._radius > 0 ? Math.PI * this._radius * this._radius : 0
        }
    }),
    Object.defineProperty(c.Circle.prototype, "empty", {
        get: function() {
            return 0 === this._diameter
        },
        set: function(a) {
            a === !0 && this.setTo(0, 0, 0)
        }
    }),
    c.Circle.contains = function(a, b, c) {
        if (a.radius > 0 && b >= a.left && b <= a.right && c >= a.top && c <= a.bottom) {
            var d = (a.x - b) * (a.x - b)
              , e = (a.y - c) * (a.y - c);
            return d + e <= a.radius * a.radius
        }
        return !1
    }
    ,
    c.Circle.equals = function(a, b) {
        return a.x == b.x && a.y == b.y && a.diameter == b.diameter
    }
    ,
    c.Circle.intersects = function(a, b) {
        return c.Math.distance(a.x, a.y, b.x, b.y) <= a.radius + b.radius
    }
    ,
    c.Circle.circumferencePoint = function(a, b, d, e) {
        return void 0 === d && (d = !1),
        void 0 === e && (e = new c.Point),
        d === !0 && (b = c.Math.degToRad(b)),
        e.x = a.x + a.radius * Math.cos(b),
        e.y = a.y + a.radius * Math.sin(b),
        e
    }
    ,
    c.Circle.intersectsRectangle = function(a, b) {
        var c = Math.abs(a.x - b.x - b.halfWidth)
          , d = b.halfWidth + a.radius;
        if (c > d)
            return !1;
        var e = Math.abs(a.y - b.y - b.halfHeight)
          , f = b.halfHeight + a.radius;
        if (e > f)
            return !1;
        if (c <= b.halfWidth || e <= b.halfHeight)
            return !0;
        var g = c - b.halfWidth
          , h = e - b.halfHeight
          , i = g * g
          , j = h * h
          , k = a.radius * a.radius;
        return k >= i + j
    }
    ,
    PIXI.Circle = c.Circle,
    c.Ellipse = function(a, b, d, e) {
        a = a || 0,
        b = b || 0,
        d = d || 0,
        e = e || 0,
        this.x = a,
        this.y = b,
        this.width = d,
        this.height = e,
        this.type = c.ELLIPSE
    }
    ,
    c.Ellipse.prototype = {
        setTo: function(a, b, c, d) {
            return this.x = a,
            this.y = b,
            this.width = c,
            this.height = d,
            this
        },
        getBounds: function() {
            return new c.Rectangle(this.x - this.width,this.y - this.height,this.width,this.height)
        },
        copyFrom: function(a) {
            return this.setTo(a.x, a.y, a.width, a.height)
        },
        copyTo: function(a) {
            return a.x = this.x,
            a.y = this.y,
            a.width = this.width,
            a.height = this.height,
            a
        },
        clone: function(a) {
            return void 0 === a || null === a ? a = new c.Ellipse(this.x,this.y,this.width,this.height) : a.setTo(this.x, this.y, this.width, this.height),
            a
        },
        contains: function(a, b) {
            return c.Ellipse.contains(this, a, b)
        },
        random: function(a) {
            void 0 === a && (a = new c.Point);
            var b = Math.random() * Math.PI * 2
              , d = Math.random();
            return a.x = Math.sqrt(d) * Math.cos(b),
            a.y = Math.sqrt(d) * Math.sin(b),
            a.x = this.x + a.x * this.width / 2,
            a.y = this.y + a.y * this.height / 2,
            a
        },
        toString: function() {
            return "[{Phaser.Ellipse (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")}]"
        }
    },
    c.Ellipse.prototype.constructor = c.Ellipse,
    Object.defineProperty(c.Ellipse.prototype, "left", {
        get: function() {
            return this.x
        },
        set: function(a) {
            this.x = a
        }
    }),
    Object.defineProperty(c.Ellipse.prototype, "right", {
        get: function() {
            return this.x + this.width
        },
        set: function(a) {
            this.width = a < this.x ? 0 : a - this.x
        }
    }),
    Object.defineProperty(c.Ellipse.prototype, "top", {
        get: function() {
            return this.y
        },
        set: function(a) {
            this.y = a
        }
    }),
    Object.defineProperty(c.Ellipse.prototype, "bottom", {
        get: function() {
            return this.y + this.height
        },
        set: function(a) {
            this.height = a < this.y ? 0 : a - this.y
        }
    }),
    Object.defineProperty(c.Ellipse.prototype, "empty", {
        get: function() {
            return 0 === this.width || 0 === this.height
        },
        set: function(a) {
            a === !0 && this.setTo(0, 0, 0, 0)
        }
    }),
    c.Ellipse.contains = function(a, b, c) {
        if (a.width <= 0 || a.height <= 0)
            return !1;
        var d = (b - a.x) / a.width - .5
          , e = (c - a.y) / a.height - .5;
        return d *= d,
        e *= e,
        .25 > d + e
    }
    ,
    PIXI.Ellipse = c.Ellipse,
    c.Line = function(a, b, d, e) {
        a = a || 0,
        b = b || 0,
        d = d || 0,
        e = e || 0,
        this.start = new c.Point(a,b),
        this.end = new c.Point(d,e),
        this.type = c.LINE
    }
    ,
    c.Line.prototype = {
        setTo: function(a, b, c, d) {
            return this.start.setTo(a, b),
            this.end.setTo(c, d),
            this
        },
        fromSprite: function(a, b, c) {
            return void 0 === c && (c = !1),
            c ? this.setTo(a.center.x, a.center.y, b.center.x, b.center.y) : this.setTo(a.x, a.y, b.x, b.y)
        },
        fromAngle: function(a, b, c, d) {
            return this.start.setTo(a, b),
            this.end.setTo(a + Math.cos(c) * d, b + Math.sin(c) * d),
            this
        },
        rotate: function(a, b) {
            var c = (this.start.x + this.end.x) / 2
              , d = (this.start.y + this.end.y) / 2;
            return this.start.rotate(c, d, a, b),
            this.end.rotate(c, d, a, b),
            this
        },
        rotateAround: function(a, b, c, d) {
            return this.start.rotate(a, b, c, d),
            this.end.rotate(a, b, c, d),
            this
        },
        intersects: function(a, b, d) {
            return c.Line.intersectsPoints(this.start, this.end, a.start, a.end, b, d)
        },
        reflect: function(a) {
            return c.Line.reflect(this, a)
        },
        midPoint: function(a) {
            return void 0 === a && (a = new c.Point),
            a.x = (this.start.x + this.end.x) / 2,
            a.y = (this.start.y + this.end.y) / 2,
            a
        },
        centerOn: function(a, b) {
            var c = (this.start.x + this.end.x) / 2
              , d = (this.start.y + this.end.y) / 2
              , e = a - c
              , f = b - d;
            this.start.add(e, f),
            this.end.add(e, f)
        },
        pointOnLine: function(a, b) {
            return (a - this.start.x) * (this.end.y - this.start.y) === (this.end.x - this.start.x) * (b - this.start.y)
        },
        pointOnSegment: function(a, b) {
            var c = Math.min(this.start.x, this.end.x)
              , d = Math.max(this.start.x, this.end.x)
              , e = Math.min(this.start.y, this.end.y)
              , f = Math.max(this.start.y, this.end.y);
            return this.pointOnLine(a, b) && a >= c && d >= a && b >= e && f >= b
        },
        random: function(a) {
            void 0 === a && (a = new c.Point);
            var b = Math.random();
            return a.x = this.start.x + b * (this.end.x - this.start.x),
            a.y = this.start.y + b * (this.end.y - this.start.y),
            a
        },
        coordinatesOnLine: function(a, b) {
            void 0 === a && (a = 1),
            void 0 === b && (b = []);
            var c = Math.round(this.start.x)
              , d = Math.round(this.start.y)
              , e = Math.round(this.end.x)
              , f = Math.round(this.end.y)
              , g = Math.abs(e - c)
              , h = Math.abs(f - d)
              , i = e > c ? 1 : -1
              , j = f > d ? 1 : -1
              , k = g - h;
            b.push([c, d]);
            for (var l = 1; c != e || d != f; ) {
                var m = k << 1;
                m > -h && (k -= h,
                c += i),
                g > m && (k += g,
                d += j),
                l % a === 0 && b.push([c, d]),
                l++
            }
            return b
        },
        clone: function(a) {
            return void 0 === a || null === a ? a = new c.Line(this.start.x,this.start.y,this.end.x,this.end.y) : a.setTo(this.start.x, this.start.y, this.end.x, this.end.y),
            a
        }
    },
    Object.defineProperty(c.Line.prototype, "length", {
        get: function() {
            return Math.sqrt((this.end.x - this.start.x) * (this.end.x - this.start.x) + (this.end.y - this.start.y) * (this.end.y - this.start.y))
        }
    }),
    Object.defineProperty(c.Line.prototype, "angle", {
        get: function() {
            return Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x)
        }
    }),
    Object.defineProperty(c.Line.prototype, "slope", {
        get: function() {
            return (this.end.y - this.start.y) / (this.end.x - this.start.x)
        }
    }),
    Object.defineProperty(c.Line.prototype, "perpSlope", {
        get: function() {
            return -((this.end.x - this.start.x) / (this.end.y - this.start.y))
        }
    }),
    Object.defineProperty(c.Line.prototype, "x", {
        get: function() {
            return Math.min(this.start.x, this.end.x)
        }
    }),
    Object.defineProperty(c.Line.prototype, "y", {
        get: function() {
            return Math.min(this.start.y, this.end.y)
        }
    }),
    Object.defineProperty(c.Line.prototype, "left", {
        get: function() {
            return Math.min(this.start.x, this.end.x)
        }
    }),
    Object.defineProperty(c.Line.prototype, "right", {
        get: function() {
            return Math.max(this.start.x, this.end.x)
        }
    }),
    Object.defineProperty(c.Line.prototype, "top", {
        get: function() {
            return Math.min(this.start.y, this.end.y)
        }
    }),
    Object.defineProperty(c.Line.prototype, "bottom", {
        get: function() {
            return Math.max(this.start.y, this.end.y)
        }
    }),
    Object.defineProperty(c.Line.prototype, "width", {
        get: function() {
            return Math.abs(this.start.x - this.end.x)
        }
    }),
    Object.defineProperty(c.Line.prototype, "height", {
        get: function() {
            return Math.abs(this.start.y - this.end.y)
        }
    }),
    Object.defineProperty(c.Line.prototype, "normalX", {
        get: function() {
            return Math.cos(this.angle - 1.5707963267948966)
        }
    }),
    Object.defineProperty(c.Line.prototype, "normalY", {
        get: function() {
            return Math.sin(this.angle - 1.5707963267948966)
        }
    }),
    Object.defineProperty(c.Line.prototype, "normalAngle", {
        get: function() {
            return c.Math.wrap(this.angle - 1.5707963267948966, -Math.PI, Math.PI)
        }
    }),
    c.Line.intersectsPoints = function(a, b, d, e, f, g) {
        void 0 === f && (f = !0),
        void 0 === g && (g = new c.Point);
        var h = b.y - a.y
          , i = e.y - d.y
          , j = a.x - b.x
          , k = d.x - e.x
          , l = b.x * a.y - a.x * b.y
          , m = e.x * d.y - d.x * e.y
          , n = h * k - i * j;
        if (0 === n)
            return null;
        if (g.x = (j * m - k * l) / n,
        g.y = (i * l - h * m) / n,
        f) {
            var o = (e.y - d.y) * (b.x - a.x) - (e.x - d.x) * (b.y - a.y)
              , p = ((e.x - d.x) * (a.y - d.y) - (e.y - d.y) * (a.x - d.x)) / o
              , q = ((b.x - a.x) * (a.y - d.y) - (b.y - a.y) * (a.x - d.x)) / o;
            return p >= 0 && 1 >= p && q >= 0 && 1 >= q ? g : null
        }
        return g
    }
    ,
    c.Line.intersects = function(a, b, d, e) {
        return c.Line.intersectsPoints(a.start, a.end, b.start, b.end, d, e)
    }
    ,
    c.Line.reflect = function(a, b) {
        return 2 * b.normalAngle - 3.141592653589793 - a.angle
    }
    ,
    c.Matrix = function(a, b, d, e, f, g) {
        a = a || 1,
        b = b || 0,
        d = d || 0,
        e = e || 1,
        f = f || 0,
        g = g || 0,
        this.a = a,
        this.b = b,
        this.c = d,
        this.d = e,
        this.tx = f,
        this.ty = g,
        this.type = c.MATRIX
    }
    ,
    c.Matrix.prototype = {
        fromArray: function(a) {
            return this.setTo(a[0], a[1], a[3], a[4], a[2], a[5])
        },
        setTo: function(a, b, c, d, e, f) {
            return this.a = a,
            this.b = b,
            this.c = c,
            this.d = d,
            this.tx = e,
            this.ty = f,
            this
        },
        clone: function(a) {
            return void 0 === a || null === a ? a = new c.Matrix(this.a,this.b,this.c,this.d,this.tx,this.ty) : (a.a = this.a,
            a.b = this.b,
            a.c = this.c,
            a.d = this.d,
            a.tx = this.tx,
            a.ty = this.ty),
            a
        },
        copyTo: function(a) {
            return a.copyFrom(this),
            a
        },
        copyFrom: function(a) {
            return this.a = a.a,
            this.b = a.b,
            this.c = a.c,
            this.d = a.d,
            this.tx = a.tx,
            this.ty = a.ty,
            this
        },
        toArray: function(a, b) {
            return void 0 === b && (b = new PIXI.Float32Array(9)),
            a ? (b[0] = this.a,
            b[1] = this.b,
            b[2] = 0,
            b[3] = this.c,
            b[4] = this.d,
            b[5] = 0,
            b[6] = this.tx,
            b[7] = this.ty,
            b[8] = 1) : (b[0] = this.a,
            b[1] = this.c,
            b[2] = this.tx,
            b[3] = this.b,
            b[4] = this.d,
            b[5] = this.ty,
            b[6] = 0,
            b[7] = 0,
            b[8] = 1),
            b
        },
        apply: function(a, b) {
            return void 0 === b && (b = new c.Point),
            b.x = this.a * a.x + this.c * a.y + this.tx,
            b.y = this.b * a.x + this.d * a.y + this.ty,
            b
        },
        applyInverse: function(a, b) {
            void 0 === b && (b = new c.Point);
            var d = 1 / (this.a * this.d + this.c * -this.b)
              , e = a.x
              , f = a.y;
            return b.x = this.d * d * e + -this.c * d * f + (this.ty * this.c - this.tx * this.d) * d,
            b.y = this.a * d * f + -this.b * d * e + (-this.ty * this.a + this.tx * this.b) * d,
            b
        },
        translate: function(a, b) {
            return this.tx += a,
            this.ty += b,
            this
        },
        scale: function(a, b) {
            return this.a *= a,
            this.d *= b,
            this.c *= a,
            this.b *= b,
            this.tx *= a,
            this.ty *= b,
            this
        },
        rotate: function(a) {
            var b = Math.cos(a)
              , c = Math.sin(a)
              , d = this.a
              , e = this.c
              , f = this.tx;
            return this.a = d * b - this.b * c,
            this.b = d * c + this.b * b,
            this.c = e * b - this.d * c,
            this.d = e * c + this.d * b,
            this.tx = f * b - this.ty * c,
            this.ty = f * c + this.ty * b,
            this
        },
        append: function(a) {
            var b = this.a
              , c = this.b
              , d = this.c
              , e = this.d;
            return this.a = a.a * b + a.b * d,
            this.b = a.a * c + a.b * e,
            this.c = a.c * b + a.d * d,
            this.d = a.c * c + a.d * e,
            this.tx = a.tx * b + a.ty * d + this.tx,
            this.ty = a.tx * c + a.ty * e + this.ty,
            this
        },
        identity: function() {
            return this.setTo(1, 0, 0, 1, 0, 0)
        }
    },
    c.identityMatrix = new c.Matrix,
    PIXI.Matrix = c.Matrix,
    PIXI.identityMatrix = c.identityMatrix,
    c.Point = function(a, b) {
        a = a || 0,
        b = b || 0,
        this.x = a,
        this.y = b,
        this.type = c.POINT
    }
    ,
    c.Point.prototype = {
        copyFrom: function(a) {
            return this.setTo(a.x, a.y)
        },
        invert: function() {
            return this.setTo(this.y, this.x)
        },
        setTo: function(a, b) {
            return this.x = a || 0,
            this.y = b || (0 !== b ? this.x : 0),
            this
        },
        set: function(a, b) {
            return this.x = a || 0,
            this.y = b || (0 !== b ? this.x : 0),
            this
        },
        add: function(a, b) {
            return this.x += a,
            this.y += b,
            this
        },
        subtract: function(a, b) {
            return this.x -= a,
            this.y -= b,
            this
        },
        multiply: function(a, b) {
            return this.x *= a,
            this.y *= b,
            this
        },
        divide: function(a, b) {
            return this.x /= a,
            this.y /= b,
            this
        },
        clampX: function(a, b) {
            return this.x = c.Math.clamp(this.x, a, b),
            this
        },
        clampY: function(a, b) {
            return this.y = c.Math.clamp(this.y, a, b),
            this
        },
        clamp: function(a, b) {
            return this.x = c.Math.clamp(this.x, a, b),
            this.y = c.Math.clamp(this.y, a, b),
            this
        },
        clone: function(a) {
            return void 0 === a || null === a ? a = new c.Point(this.x,this.y) : a.setTo(this.x, this.y),
            a
        },
        copyTo: function(a) {
            return a.x = this.x,
            a.y = this.y,
            a
        },
        distance: function(a, b) {
            return c.Point.distance(this, a, b)
        },
        equals: function(a) {
            return a.x === this.x && a.y === this.y
        },
        angle: function(a, b) {
            return void 0 === b && (b = !1),
            b ? c.Math.radToDeg(Math.atan2(a.y - this.y, a.x - this.x)) : Math.atan2(a.y - this.y, a.x - this.x)
        },
        rotate: function(a, b, d, e, f) {
            return c.Point.rotate(this, a, b, d, e, f)
        },
        getMagnitude: function() {
            return Math.sqrt(this.x * this.x + this.y * this.y)
        },
        getMagnitudeSq: function() {
            return this.x * this.x + this.y * this.y
        },
        setMagnitude: function(a) {
            return this.normalize().multiply(a, a)
        },
        normalize: function() {
            if (!this.isZero()) {
                var a = this.getMagnitude();
                this.x /= a,
                this.y /= a
            }
            return this
        },
        isZero: function() {
            return 0 === this.x && 0 === this.y
        },
        dot: function(a) {
            return this.x * a.x + this.y * a.y
        },
        cross: function(a) {
            return this.x * a.y - this.y * a.x
        },
        perp: function() {
            return this.setTo(-this.y, this.x)
        },
        rperp: function() {
            return this.setTo(this.y, -this.x)
        },
        normalRightHand: function() {
            return this.setTo(-1 * this.y, this.x)
        },
        floor: function() {
            return this.setTo(Math.floor(this.x), Math.floor(this.y))
        },
        ceil: function() {
            return this.setTo(Math.ceil(this.x), Math.ceil(this.y))
        },
        toString: function() {
            return "[{Point (x=" + this.x + " y=" + this.y + ")}]"
        }
    },
    c.Point.prototype.constructor = c.Point,
    c.Point.add = function(a, b, d) {
        return void 0 === d && (d = new c.Point),
        d.x = a.x + b.x,
        d.y = a.y + b.y,
        d
    }
    ,
    c.Point.subtract = function(a, b, d) {
        return void 0 === d && (d = new c.Point),
        d.x = a.x - b.x,
        d.y = a.y - b.y,
        d
    }
    ,
    c.Point.multiply = function(a, b, d) {
        return void 0 === d && (d = new c.Point),
        d.x = a.x * b.x,
        d.y = a.y * b.y,
        d
    }
    ,
    c.Point.divide = function(a, b, d) {
        return void 0 === d && (d = new c.Point),
        d.x = a.x / b.x,
        d.y = a.y / b.y,
        d
    }
    ,
    c.Point.equals = function(a, b) {
        return a.x === b.x && a.y === b.y
    }
    ,
    c.Point.angle = function(a, b) {
        return Math.atan2(a.y - b.y, a.x - b.x)
    }
    ,
    c.Point.negative = function(a, b) {
        return void 0 === b && (b = new c.Point),
        b.setTo(-a.x, -a.y)
    }
    ,
    c.Point.multiplyAdd = function(a, b, d, e) {
        return void 0 === e && (e = new c.Point),
        e.setTo(a.x + b.x * d, a.y + b.y * d)
    }
    ,
    c.Point.interpolate = function(a, b, d, e) {
        return void 0 === e && (e = new c.Point),
        e.setTo(a.x + (b.x - a.x) * d, a.y + (b.y - a.y) * d)
    }
    ,
    c.Point.perp = function(a, b) {
        return void 0 === b && (b = new c.Point),
        b.setTo(-a.y, a.x)
    }
    ,
    c.Point.rperp = function(a, b) {
        return void 0 === b && (b = new c.Point),
        b.setTo(a.y, -a.x)
    }
    ,
    c.Point.distance = function(a, b, d) {
        var e = c.Math.distance(a.x, a.y, b.x, b.y);
        return d ? Math.round(e) : e
    }
    ,
    c.Point.project = function(a, b, d) {
        void 0 === d && (d = new c.Point);
        var e = a.dot(b) / b.getMagnitudeSq();
        return 0 !== e && d.setTo(e * b.x, e * b.y),
        d
    }
    ,
    c.Point.projectUnit = function(a, b, d) {
        void 0 === d && (d = new c.Point);
        var e = a.dot(b);
        return 0 !== e && d.setTo(e * b.x, e * b.y),
        d
    }
    ,
    c.Point.normalRightHand = function(a, b) {
        return void 0 === b && (b = new c.Point),
        b.setTo(-1 * a.y, a.x)
    }
    ,
    c.Point.normalize = function(a, b) {
        void 0 === b && (b = new c.Point);
        var d = a.getMagnitude();
        return 0 !== d && b.setTo(a.x / d, a.y / d),
        b
    }
    ,
    c.Point.rotate = function(a, b, d, e, f, g) {
        if (f && (e = c.Math.degToRad(e)),
        void 0 === g) {
            a.subtract(b, d);
            var h = Math.sin(e)
              , i = Math.cos(e)
              , j = i * a.x - h * a.y
              , k = h * a.x + i * a.y;
            a.x = j + b,
            a.y = k + d
        } else {
            var l = e + Math.atan2(a.y - d, a.x - b);
            a.x = b + g * Math.cos(l),
            a.y = d + g * Math.sin(l)
        }
        return a
    }
    ,
    c.Point.centroid = function(a, b) {
        if (void 0 === b && (b = new c.Point),
        "[object Array]" !== Object.prototype.toString.call(a))
            throw new Error("Phaser.Point. Parameter 'points' must be an array");
        var d = a.length;
        if (1 > d)
            throw new Error("Phaser.Point. Parameter 'points' array must not be empty");
        if (1 === d)
            return b.copyFrom(a[0]),
            b;
        for (var e = 0; d > e; e++)
            c.Point.add(b, a[e], b);
        return b.divide(d, d),
        b
    }
    ,
    c.Point.parse = function(a, b, d) {
        b = b || "x",
        d = d || "y";
        var e = new c.Point;
        return a[b] && (e.x = parseInt(a[b], 10)),
        a[d] && (e.y = parseInt(a[d], 10)),
        e
    }
    ,
    PIXI.Point = c.Point,
    c.Polygon = function() {
        this.area = 0,
        this._points = [],
        arguments.length > 0 && this.setTo.apply(this, arguments),
        this.closed = !0,
        this.type = c.POLYGON
    }
    ,
    c.Polygon.prototype = {
        toNumberArray: function(a) {
            void 0 === a && (a = []);
            for (var b = 0; b < this._points.length; b++)
                "number" == typeof this._points[b] ? (a.push(this._points[b]),
                a.push(this._points[b + 1]),
                b++) : (a.push(this._points[b].x),
                a.push(this._points[b].y));
            return a
        },
        flatten: function() {
            return this._points = this.toNumberArray(),
            this
        },
        clone: function(a) {
            var b = this._points.slice();
            return void 0 === a || null === a ? a = new c.Polygon(b) : a.setTo(b),
            a
        },
        contains: function(a, b) {
            for (var c = this._points.length, d = !1, e = -1, f = c - 1; ++e < c; f = e) {
                var g = this._points[e].x
                  , h = this._points[e].y
                  , i = this._points[f].x
                  , j = this._points[f].y;
                (b >= h && j > b || b >= j && h > b) && (i - g) * (b - h) / (j - h) + g > a && (d = !d)
            }
            return d
        },
        setTo: function(a) {
            if (this.area = 0,
            this._points = [],
            arguments.length > 0) {
                Array.isArray(a) || (a = Array.prototype.slice.call(arguments));
                for (var b = Number.MAX_VALUE, c = 0, d = a.length; d > c; c++) {
                    if ("number" == typeof a[c]) {
                        var e = new PIXI.Point(a[c],a[c + 1]);
                        c++
                    } else
                        var e = new PIXI.Point(a[c].x,a[c].y);
                    this._points.push(e),
                    e.y < b && (b = e.y)
                }
                this.calculateArea(b)
            }
            return this
        },
        calculateArea: function(a) {
            for (var b, c, d, e, f = 0, g = this._points.length; g > f; f++)
                b = this._points[f],
                c = f === g - 1 ? this._points[0] : this._points[f + 1],
                d = (b.y - a + (c.y - a)) / 2,
                e = b.x - c.x,
                this.area += d * e;
            return this.area
        }
    },
    c.Polygon.prototype.constructor = c.Polygon,
    Object.defineProperty(c.Polygon.prototype, "points", {
        get: function() {
            return this._points
        },
        set: function(a) {
            null != a ? this.setTo(a) : this.setTo()
        }
    }),
    PIXI.Polygon = c.Polygon,
    c.Rectangle = function(a, b, d, e) {
        a = a || 0,
        b = b || 0,
        d = d || 0,
        e = e || 0,
        this.x = a,
        this.y = b,
        this.width = d,
        this.height = e,
        this.type = c.RECTANGLE
    }
    ,
    c.Rectangle.prototype = {
        offset: function(a, b) {
            return this.x += a,
            this.y += b,
            this
        },
        offsetPoint: function(a) {
            return this.offset(a.x, a.y)
        },
        setTo: function(a, b, c, d) {
            return this.x = a,
            this.y = b,
            this.width = c,
            this.height = d,
            this
        },
        scale: function(a, b) {
            return void 0 === b && (b = a),
            this.width *= a,
            this.height *= b,
            this
        },
        centerOn: function(a, b) {
            return this.centerX = a,
            this.centerY = b,
            this
        },
        floor: function() {
            this.x = Math.floor(this.x),
            this.y = Math.floor(this.y)
        },
        floorAll: function() {
            this.x = Math.floor(this.x),
            this.y = Math.floor(this.y),
            this.width = Math.floor(this.width),
            this.height = Math.floor(this.height)
        },
        ceil: function() {
            this.x = Math.ceil(this.x),
            this.y = Math.ceil(this.y)
        },
        ceilAll: function() {
            this.x = Math.ceil(this.x),
            this.y = Math.ceil(this.y),
            this.width = Math.ceil(this.width),
            this.height = Math.ceil(this.height)
        },
        copyFrom: function(a) {
            return this.setTo(a.x, a.y, a.width, a.height)
        },
        copyTo: function(a) {
            return a.x = this.x,
            a.y = this.y,
            a.width = this.width,
            a.height = this.height,
            a
        },
        inflate: function(a, b) {
            return c.Rectangle.inflate(this, a, b)
        },
        size: function(a) {
            return c.Rectangle.size(this, a)
        },
        resize: function(a, b) {
            return this.width = a,
            this.height = b,
            this
        },
        clone: function(a) {
            return c.Rectangle.clone(this, a)
        },
        contains: function(a, b) {
            return c.Rectangle.contains(this, a, b)
        },
        containsRect: function(a) {
            return c.Rectangle.containsRect(a, this)
        },
        equals: function(a) {
            return c.Rectangle.equals(this, a)
        },
        intersection: function(a, b) {
            return c.Rectangle.intersection(this, a, b)
        },
        intersects: function(a) {
            return c.Rectangle.intersects(this, a)
        },
        intersectsRaw: function(a, b, d, e, f) {
            return c.Rectangle.intersectsRaw(this, a, b, d, e, f)
        },
        union: function(a, b) {
            return c.Rectangle.union(this, a, b)
        },
        random: function(a) {
            return void 0 === a && (a = new c.Point),
            a.x = this.randomX,
            a.y = this.randomY,
            a
        },
        toString: function() {
            return "[{Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + " empty=" + this.empty + ")}]"
        }
    },
    Object.defineProperty(c.Rectangle.prototype, "halfWidth", {
        get: function() {
            return Math.round(this.width / 2)
        }
    }),
    Object.defineProperty(c.Rectangle.prototype, "halfHeight", {
        get: function() {
            return Math.round(this.height / 2)
        }
    }),
    Object.defineProperty(c.Rectangle.prototype, "bottom", {
        get: function() {
            return this.y + this.height
        },
        set: function(a) {
            this.height = a <= this.y ? 0 : a - this.y
        }
    }),
    Object.defineProperty(c.Rectangle.prototype, "bottomLeft", {
        get: function() {
            return new c.Point(this.x,this.bottom)
        },
        set: function(a) {
            this.x = a.x,
            this.bottom = a.y
        }
    }),
    Object.defineProperty(c.Rectangle.prototype, "bottomRight", {
        get: function() {
            return new c.Point(this.right,this.bottom)
        },
        set: function(a) {
            this.right = a.x,
            this.bottom = a.y
        }
    }),
    Object.defineProperty(c.Rectangle.prototype, "left", {
        get: function() {
            return this.x
        },
        set: function(a) {
            this.width = a >= this.right ? 0 : this.right - a,
            this.x = a
        }
    }),
    Object.defineProperty(c.Rectangle.prototype, "right", {
        get: function() {
            return this.x + this.width
        },
        set: function(a) {
            this.width = a <= this.x ? 0 : a - this.x
        }
    }),
    Object.defineProperty(c.Rectangle.prototype, "volume", {
        get: function() {
            return this.width * this.height
        }
    }),
    Object.defineProperty(c.Rectangle.prototype, "perimeter", {
        get: function() {
            return 2 * this.width + 2 * this.height
        }
    }),
    Object.defineProperty(c.Rectangle.prototype, "centerX", {
        get: function() {
            return this.x + this.halfWidth
        },
        set: function(a) {
            this.x = a - this.halfWidth
        }
    }),
    Object.defineProperty(c.Rectangle.prototype, "centerY", {
        get: function() {
            return this.y + this.halfHeight
        },
        set: function(a) {
            this.y = a - this.halfHeight
        }
    }),
    Object.defineProperty(c.Rectangle.prototype, "randomX", {
        get: function() {
            return this.x + Math.random() * this.width
        }
    }),
    Object.defineProperty(c.Rectangle.prototype, "randomY", {
        get: function() {
            return this.y + Math.random() * this.height
        }
    }),
    Object.defineProperty(c.Rectangle.prototype, "top", {
        get: function() {
            return this.y
        },
        set: function(a) {
            a >= this.bottom ? (this.height = 0,
            this.y = a) : this.height = this.bottom - a
        }
    }),
    Object.defineProperty(c.Rectangle.prototype, "topLeft", {
        get: function() {
            return new c.Point(this.x,this.y)
        },
        set: function(a) {
            this.x = a.x,
            this.y = a.y
        }
    }),
    Object.defineProperty(c.Rectangle.prototype, "topRight", {
        get: function() {
            return new c.Point(this.x + this.width,this.y)
        },
        set: function(a) {
            this.right = a.x,
            this.y = a.y
        }
    }),
    Object.defineProperty(c.Rectangle.prototype, "empty", {
        get: function() {
            return !this.width || !this.height
        },
        set: function(a) {
            a === !0 && this.setTo(0, 0, 0, 0)
        }
    }),
    c.Rectangle.prototype.constructor = c.Rectangle,
    c.Rectangle.inflate = function(a, b, c) {
        return a.x -= b,
        a.width += 2 * b,
        a.y -= c,
        a.height += 2 * c,
        a
    }
    ,
    c.Rectangle.inflatePoint = function(a, b) {
        return c.Rectangle.inflate(a, b.x, b.y)
    }
    ,
    c.Rectangle.size = function(a, b) {
        return void 0 === b || null === b ? b = new c.Point(a.width,a.height) : b.setTo(a.width, a.height),
        b
    }
    ,
    c.Rectangle.clone = function(a, b) {
        return void 0 === b || null === b ? b = new c.Rectangle(a.x,a.y,a.width,a.height) : b.setTo(a.x, a.y, a.width, a.height),
        b
    }
    ,
    c.Rectangle.contains = function(a, b, c) {
        return a.width <= 0 || a.height <= 0 ? !1 : b >= a.x && b < a.right && c >= a.y && c < a.bottom
    }
    ,
    c.Rectangle.containsRaw = function(a, b, c, d, e, f) {
        return e >= a && a + c > e && f >= b && b + d > f
    }
    ,
    c.Rectangle.containsPoint = function(a, b) {
        return c.Rectangle.contains(a, b.x, b.y)
    }
    ,
    c.Rectangle.containsRect = function(a, b) {
        return a.volume > b.volume ? !1 : a.x >= b.x && a.y >= b.y && a.right < b.right && a.bottom < b.bottom
    }
    ,
    c.Rectangle.equals = function(a, b) {
        return a.x == b.x && a.y == b.y && a.width == b.width && a.height == b.height
    }
    ,
    c.Rectangle.sameDimensions = function(a, b) {
        return a.width === b.width && a.height === b.height
    }
    ,
    c.Rectangle.intersection = function(a, b, d) {
        return void 0 === d && (d = new c.Rectangle),
        c.Rectangle.intersects(a, b) && (d.x = Math.max(a.x, b.x),
        d.y = Math.max(a.y, b.y),
        d.width = Math.min(a.right, b.right) - d.x,
        d.height = Math.min(a.bottom, b.bottom) - d.y),
        d
    }
    ,
    c.Rectangle.intersects = function(a, b) {
        return a.width <= 0 || a.height <= 0 || b.width <= 0 || b.height <= 0 ? !1 : !(a.right < b.x || a.bottom < b.y || a.x > b.right || a.y > b.bottom)
    }
    ,
    c.Rectangle.intersectsRaw = function(a, b, c, d, e, f) {
        return void 0 === f && (f = 0),
        !(b > a.right + f || c < a.left - f || d > a.bottom + f || e < a.top - f)
    }
    ,
    c.Rectangle.union = function(a, b, d) {
        return void 0 === d && (d = new c.Rectangle),
        d.setTo(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.max(a.right, b.right) - Math.min(a.left, b.left), Math.max(a.bottom, b.bottom) - Math.min(a.top, b.top))
    }
    ,
    c.Rectangle.aabb = function(a, b) {
        void 0 === b && (b = new c.Rectangle);
        var d = Number.MIN_VALUE
          , e = Number.MAX_VALUE
          , f = Number.MIN_VALUE
          , g = Number.MAX_VALUE;
        return a.forEach(function(a) {
            a.x > d && (d = a.x),
            a.x < e && (e = a.x),
            a.y > f && (f = a.y),
            a.y < g && (g = a.y)
        }),
        b.setTo(e, g, d - e, f - g),
        b
    }
    ,
    PIXI.Rectangle = c.Rectangle,
    PIXI.EmptyRectangle = new c.Rectangle(0,0,0,0),
    c.RoundedRectangle = function(a, b, d, e, f) {
        void 0 === a && (a = 0),
        void 0 === b && (b = 0),
        void 0 === d && (d = 0),
        void 0 === e && (e = 0),
        void 0 === f && (f = 20),
        this.x = a,
        this.y = b,
        this.width = d,
        this.height = e,
        this.radius = f || 20,
        this.type = c.ROUNDEDRECTANGLE
    }
    ,
    c.RoundedRectangle.prototype = {
        clone: function() {
            return new c.RoundedRectangle(this.x,this.y,this.width,this.height,this.radius)
        },
        contains: function(a, b) {
            if (this.width <= 0 || this.height <= 0)
                return !1;
            var c = this.x;
            if (a >= c && a <= c + this.width) {
                var d = this.y;
                if (b >= d && b <= d + this.height)
                    return !0
            }
            return !1
        }
    },
    c.RoundedRectangle.prototype.constructor = c.RoundedRectangle,
    PIXI.RoundedRectangle = c.RoundedRectangle,
    c.Camera = function(a, b, d, e, f, g) {
        this.game = a,
        this.world = a.world,
        this.id = 0,
        this.view = new c.Rectangle(d,e,f,g),
        this.bounds = new c.Rectangle(d,e,f,g),
        this.deadzone = null,
        this.visible = !0,
        this.roundPx = !0,
        this.atLimit = {
            x: !1,
            y: !1
        },
        this.target = null,
        this.displayObject = null,
        this.scale = null,
        this.totalInView = 0,
        this._targetPosition = new c.Point,
        this._edge = 0,
        this._position = new c.Point
    }
    ,
    c.Camera.FOLLOW_LOCKON = 0,
    c.Camera.FOLLOW_PLATFORMER = 1,
    c.Camera.FOLLOW_TOPDOWN = 2,
    c.Camera.FOLLOW_TOPDOWN_TIGHT = 3,
    c.Camera.prototype = {
        preUpdate: function() {
            this.totalInView = 0
        },
        follow: function(a, b) {
            void 0 === b && (b = c.Camera.FOLLOW_LOCKON),
            this.target = a;
            var d;
            switch (b) {
            case c.Camera.FOLLOW_PLATFORMER:
                var e = this.width / 8
                  , f = this.height / 3;
                this.deadzone = new c.Rectangle((this.width - e) / 2,(this.height - f) / 2 - .25 * f,e,f);
                break;
            case c.Camera.FOLLOW_TOPDOWN:
                d = Math.max(this.width, this.height) / 4,
                this.deadzone = new c.Rectangle((this.width - d) / 2,(this.height - d) / 2,d,d);
                break;
            case c.Camera.FOLLOW_TOPDOWN_TIGHT:
                d = Math.max(this.width, this.height) / 8,
                this.deadzone = new c.Rectangle((this.width - d) / 2,(this.height - d) / 2,d,d);
                break;
            case c.Camera.FOLLOW_LOCKON:
                this.deadzone = null;
                break;
            default:
                this.deadzone = null
            }
        },
        unfollow: function() {
            this.target = null
        },
        focusOn: function(a) {
            this.setPosition(Math.round(a.x - this.view.halfWidth), Math.round(a.y - this.view.halfHeight))
        },
        focusOnXY: function(a, b) {
            this.setPosition(Math.round(a - this.view.halfWidth), Math.round(b - this.view.halfHeight))
        },
        update: function() {
            this.target && this.updateTarget(),
            this.bounds && this.checkBounds(),
            this.roundPx && this.view.floor(),
            this.displayObject.position.x = -this.view.x,
            this.displayObject.position.y = -this.view.y
        },
        updateTarget: function() {
            this._targetPosition.copyFrom(this.target),
            this.target.parent && this._targetPosition.multiply(this.target.parent.worldTransform.a, this.target.parent.worldTransform.d),
            this.deadzone ? (this._edge = this._targetPosition.x - this.view.x,
            this._edge < this.deadzone.left ? this.view.x = this._targetPosition.x - this.deadzone.left : this._edge > this.deadzone.right && (this.view.x = this._targetPosition.x - this.deadzone.right),
            this._edge = this._targetPosition.y - this.view.y,
            this._edge < this.deadzone.top ? this.view.y = this._targetPosition.y - this.deadzone.top : this._edge > this.deadzone.bottom && (this.view.y = this._targetPosition.y - this.deadzone.bottom)) : (this.view.x = this._targetPosition.x - this.view.halfWidth,
            this.view.y = this._targetPosition.y - this.view.halfHeight)
        },
        setBoundsToWorld: function() {
            this.bounds.copyFrom(this.game.world.bounds)
        },
        checkBounds: function() {
            this.atLimit.x = !1,
            this.atLimit.y = !1,
            this.view.x <= this.bounds.x && (this.atLimit.x = !0,
            this.view.x = this.bounds.x),
            this.view.right >= this.bounds.right && (this.atLimit.x = !0,
            this.view.x = this.bounds.right - this.width),
            this.view.y <= this.bounds.top && (this.atLimit.y = !0,
            this.view.y = this.bounds.top),
            this.view.bottom >= this.bounds.bottom && (this.atLimit.y = !0,
            this.view.y = this.bounds.bottom - this.height)
        },
        setPosition: function(a, b) {
            this.view.x = a,
            this.view.y = b,
            this.bounds && this.checkBounds()
        },
        setSize: function(a, b) {
            this.view.width = a,
            this.view.height = b
        },
        reset: function() {
            this.target = null,
            this.view.x = 0,
            this.view.y = 0
        }
    },
    c.Camera.prototype.constructor = c.Camera,
    Object.defineProperty(c.Camera.prototype, "x", {
        get: function() {
            return this.view.x
        },
        set: function(a) {
            this.view.x = a,
            this.bounds && this.checkBounds()
        }
    }),
    Object.defineProperty(c.Camera.prototype, "y", {
        get: function() {
            return this.view.y
        },
        set: function(a) {
            this.view.y = a,
            this.bounds && this.checkBounds()
        }
    }),
    Object.defineProperty(c.Camera.prototype, "position", {
        get: function() {
            return this._position.set(this.view.centerX, this.view.centerY),
            this._position
        },
        set: function(a) {
            "undefined" != typeof a.x && (this.view.x = a.x),
            "undefined" != typeof a.y && (this.view.y = a.y),
            this.bounds && this.checkBounds()
        }
    }),
    Object.defineProperty(c.Camera.prototype, "width", {
        get: function() {
            return this.view.width
        },
        set: function(a) {
            this.view.width = a
        }
    }),
    Object.defineProperty(c.Camera.prototype, "height", {
        get: function() {
            return this.view.height
        },
        set: function(a) {
            this.view.height = a
        }
    }),
    c.Create = function(a) {
        this.game = a,
        this.bmd = a.make.bitmapData(),
        this.canvas = this.bmd.canvas,
        this.ctx = this.bmd.context,
        this.palettes = [{
            0: "#000",
            1: "#9D9D9D",
            2: "#FFF",
            3: "#BE2633",
            4: "#E06F8B",
            5: "#493C2B",
            6: "#A46422",
            7: "#EB8931",
            8: "#F7E26B",
            9: "#2F484E",
            A: "#44891A",
            B: "#A3CE27",
            C: "#1B2632",
            D: "#005784",
            E: "#31A2F2",
            F: "#B2DCEF"
        }, {
            0: "#000",
            1: "#191028",
            2: "#46af45",
            3: "#a1d685",
            4: "#453e78",
            5: "#7664fe",
            6: "#833129",
            7: "#9ec2e8",
            8: "#dc534b",
            9: "#e18d79",
            A: "#d6b97b",
            B: "#e9d8a1",
            C: "#216c4b",
            D: "#d365c8",
            E: "#afaab9",
            F: "#f5f4eb"
        }, {
            0: "#000",
            1: "#2234d1",
            2: "#0c7e45",
            3: "#44aacc",
            4: "#8a3622",
            5: "#5c2e78",
            6: "#aa5c3d",
            7: "#b5b5b5",
            8: "#5e606e",
            9: "#4c81fb",
            A: "#6cd947",
            B: "#7be2f9",
            C: "#eb8a60",
            D: "#e23d69",
            E: "#ffd93f",
            F: "#fff"
        }, {
            0: "#000",
            1: "#fff",
            2: "#8b4131",
            3: "#7bbdc5",
            4: "#8b41ac",
            5: "#6aac41",
            6: "#3931a4",
            7: "#d5de73",
            8: "#945a20",
            9: "#5a4100",
            A: "#bd736a",
            B: "#525252",
            C: "#838383",
            D: "#acee8b",
            E: "#7b73de",
            F: "#acacac"
        }, {
            0: "#000",
            1: "#191028",
            2: "#46af45",
            3: "#a1d685",
            4: "#453e78",
            5: "#7664fe",
            6: "#833129",
            7: "#9ec2e8",
            8: "#dc534b",
            9: "#e18d79",
            A: "#d6b97b",
            B: "#e9d8a1",
            C: "#216c4b",
            D: "#d365c8",
            E: "#afaab9",
            F: "#fff"
        }]
    }
    ,
    c.Create.PALETTE_ARNE = 0,
    c.Create.PALETTE_JMP = 1,
    c.Create.PALETTE_CGA = 2,
    c.Create.PALETTE_C64 = 3,
    c.Create.PALETTE_JAPANESE_MACHINE = 4,
    c.Create.prototype = {
        texture: function(a, b, c, d, e) {
            void 0 === c && (c = 8),
            void 0 === d && (d = c),
            void 0 === e && (e = 0);
            var f = b[0].length * c
              , g = b.length * d;
            this.bmd.resize(f, g),
            this.bmd.clear();
            for (var h = 0; h < b.length; h++)
                for (var i = b[h], j = 0; j < i.length; j++) {
                    var k = i[j];
                    "." !== k && " " !== k && (this.ctx.fillStyle = this.palettes[e][k],
                    this.ctx.fillRect(j * c, h * d, c, d))
                }
            return this.bmd.generateTexture(a)
        },
        grid: function(a, b, c, d, e, f) {
            this.bmd.resize(b, c),
            this.ctx.fillStyle = f;
            for (var g = 0; c > g; g += e)
                this.ctx.fillRect(0, g, b, 1);
            for (var h = 0; b > h; h += d)
                this.ctx.fillRect(h, 0, 1, c);
            return this.bmd.generateTexture(a)
        }
    },
    c.Create.prototype.constructor = c.Create,
    c.State = function() {
        this.game = null,
        this.key = "",
        this.add = null,
        this.make = null,
        this.camera = null,
        this.cache = null,
        this.input = null,
        this.load = null,
        this.math = null,
        this.sound = null,
        this.scale = null,
        this.stage = null,
        this.time = null,
        this.tweens = null,
        this.world = null,
        this.particles = null,
        this.physics = null,
        this.rnd = null
    }
    ,
    c.State.prototype = {
        init: function() {},
        preload: function() {},
        loadUpdate: function() {},
        loadRender: function() {},
        create: function() {},
        update: function() {},
        preRender: function() {},
        render: function() {},
        resize: function() {},
        paused: function() {},
        resumed: function() {},
        pauseUpdate: function() {},
        shutdown: function() {}
    },
    c.State.prototype.constructor = c.State,
    c.StateManager = function(a, b) {
        this.game = a,
        this.states = {},
        this._pendingState = null,
        "undefined" != typeof b && null !== b && (this._pendingState = b),
        this._clearWorld = !1,
        this._clearCache = !1,
        this._created = !1,
        this._args = [],
        this.current = "",
        this.onStateChange = new c.Signal,
        this.onInitCallback = null,
        this.onPreloadCallback = null,
        this.onCreateCallback = null,
        this.onUpdateCallback = null,
        this.onRenderCallback = null,
        this.onResizeCallback = null,
        this.onPreRenderCallback = null,
        this.onLoadUpdateCallback = null,
        this.onLoadRenderCallback = null,
        this.onPausedCallback = null,
        this.onResumedCallback = null,
        this.onPauseUpdateCallback = null,
        this.onShutDownCallback = null
    }
    ,
    c.StateManager.prototype = {
        boot: function() {
            this.game.onPause.add(this.pause, this),
            this.game.onResume.add(this.resume, this),
            null !== this._pendingState && "string" != typeof this._pendingState && this.add("default", this._pendingState, !0)
        },
        add: function(a, b, d) {
            void 0 === d && (d = !1);
            var e;
            return b instanceof c.State ? e = b : "object" == typeof b ? (e = b,
            e.game = this.game) : "function" == typeof b && (e = new b(this.game)),
            this.states[a] = e,
            d && (this.game.isBooted ? this.start(a) : this._pendingState = a),
            e
        },
        remove: function(a) {
            this.current === a && (this.callbackContext = null,
            this.onInitCallback = null,
            this.onShutDownCallback = null,
            this.onPreloadCallback = null,
            this.onLoadRenderCallback = null,
            this.onLoadUpdateCallback = null,
            this.onCreateCallback = null,
            this.onUpdateCallback = null,
            this.onPreRenderCallback = null,
            this.onRenderCallback = null,
            this.onResizeCallback = null,
            this.onPausedCallback = null,
            this.onResumedCallback = null,
            this.onPauseUpdateCallback = null),
            delete this.states[a]
        },
        start: function(a, b, c) {
            void 0 === b && (b = !0),
            void 0 === c && (c = !1),
            this.checkState(a) && (this._pendingState = a,
            this._clearWorld = b,
            this._clearCache = c,
            arguments.length > 3 && (this._args = Array.prototype.splice.call(arguments, 3)))
        },
        restart: function(a, b) {
            void 0 === a && (a = !0),
            void 0 === b && (b = !1),
            this._pendingState = this.current,
            this._clearWorld = a,
            this._clearCache = b,
            arguments.length > 2 && (this._args = Array.prototype.splice.call(arguments, 2))
        },
        dummy: function() {},
        preUpdate: function() {
            if (this._pendingState && this.game.isBooted) {
                var a = this.current;
                if (this.clearCurrentState(),
                this.setCurrentState(this._pendingState),
                this.onStateChange.dispatch(this.current, a),
                this.current !== this._pendingState)
                    return;
                this._pendingState = null,
                this.onPreloadCallback ? (this.game.load.reset(!0),
                this.onPreloadCallback.call(this.callbackContext, this.game),
                0 === this.game.load.totalQueuedFiles() && 0 === this.game.load.totalQueuedPacks() ? this.loadComplete() : this.game.load.start()) : this.loadComplete()
            }
        },
        clearCurrentState: function() {
            this.current && (this.onShutDownCallback && this.onShutDownCallback.call(this.callbackContext, this.game),
            this.game.tweens.removeAll(),
            this.game.camera.reset(),
            this.game.input.reset(!0),
            this.game.physics.clear(),
            this.game.time.removeAll(),
            this.game.scale.reset(this._clearWorld),
            this.game.debug && this.game.debug.reset(),
            this._clearWorld && (this.game.world.shutdown(),
            this._clearCache === !0 && this.game.cache.destroy()))
        },
        checkState: function(a) {
            if (this.states[a]) {
                var b = !1;
                return (this.states[a].preload || this.states[a].create || this.states[a].update || this.states[a].render) && (b = !0),
                b === !1 ? (console.warn("Invalid Phaser State object given. Must contain at least a one of the required functions: preload, create, update or render"),
                !1) : !0
            }
            return console.warn("Phaser.StateManager - No state found with the key: " + a),
            !1
        },
        link: function(a) {
            this.states[a].game = this.game,
            this.states[a].add = this.game.add,
            this.states[a].make = this.game.make,
            this.states[a].camera = this.game.camera,
            this.states[a].cache = this.game.cache,
            this.states[a].input = this.game.input,
            this.states[a].load = this.game.load,
            this.states[a].math = this.game.math,
            this.states[a].sound = this.game.sound,
            this.states[a].scale = this.game.scale,
            this.states[a].state = this,
            this.states[a].stage = this.game.stage,
            this.states[a].time = this.game.time,
            this.states[a].tweens = this.game.tweens,
            this.states[a].world = this.game.world,
            this.states[a].particles = this.game.particles,
            this.states[a].rnd = this.game.rnd,
            this.states[a].physics = this.game.physics,
            this.states[a].key = a
        },
        unlink: function(a) {
            this.states[a] && (this.states[a].game = null,
            this.states[a].add = null,
            this.states[a].make = null,
            this.states[a].camera = null,
            this.states[a].cache = null,
            this.states[a].input = null,
            this.states[a].load = null,
            this.states[a].math = null,
            this.states[a].sound = null,
            this.states[a].scale = null,
            this.states[a].state = null,
            this.states[a].stage = null,
            this.states[a].time = null,
            this.states[a].tweens = null,
            this.states[a].world = null,
            this.states[a].particles = null,
            this.states[a].rnd = null,
            this.states[a].physics = null)
        },
        setCurrentState: function(a) {
            this.callbackContext = this.states[a],
            this.link(a),
            this.onInitCallback = this.states[a].init || this.dummy,
            this.onPreloadCallback = this.states[a].preload || null,
            this.onLoadRenderCallback = this.states[a].loadRender || null,
            this.onLoadUpdateCallback = this.states[a].loadUpdate || null,
            this.onCreateCallback = this.states[a].create || null,
            this.onUpdateCallback = this.states[a].update || null,
            this.onPreRenderCallback = this.states[a].preRender || null,
            this.onRenderCallback = this.states[a].render || null,
            this.onResizeCallback = this.states[a].resize || null,
            this.onPausedCallback = this.states[a].paused || null,
            this.onResumedCallback = this.states[a].resumed || null,
            this.onPauseUpdateCallback = this.states[a].pauseUpdate || null,
            this.onShutDownCallback = this.states[a].shutdown || this.dummy,
            "" !== this.current && this.game.physics.reset(),
            this.current = a,
            this._created = !1,
            this.onInitCallback.apply(this.callbackContext, this._args),
            a === this._pendingState && (this._args = []),
            this.game._kickstart = !0
        },
        getCurrentState: function() {
            return this.states[this.current]
        },
        loadComplete: function() {
            this._created === !1 && this.onCreateCallback ? (this._created = !0,
            this.onCreateCallback.call(this.callbackContext, this.game)) : this._created = !0
        },
        pause: function() {
            this._created && this.onPausedCallback && this.onPausedCallback.call(this.callbackContext, this.game)
        },
        resume: function() {
            this._created && this.onResumedCallback && this.onResumedCallback.call(this.callbackContext, this.game)
        },
        update: function() {
            this._created ? this.onUpdateCallback && this.onUpdateCallback.call(this.callbackContext, this.game) : this.onLoadUpdateCallback && this.onLoadUpdateCallback.call(this.callbackContext, this.game)
        },
        pauseUpdate: function() {
            this._created ? this.onPauseUpdateCallback && this.onPauseUpdateCallback.call(this.callbackContext, this.game) : this.onLoadUpdateCallback && this.onLoadUpdateCallback.call(this.callbackContext, this.game)
        },
        preRender: function(a) {
            this._created && this.onPreRenderCallback && this.onPreRenderCallback.call(this.callbackContext, this.game, a)
        },
        resize: function(a, b) {
            this.onResizeCallback && this.onResizeCallback.call(this.callbackContext, a, b)
        },
        render: function() {
            this._created ? this.onRenderCallback && (this.game.renderType === c.CANVAS ? (this.game.context.save(),
            this.game.context.setTransform(1, 0, 0, 1, 0, 0),
            this.onRenderCallback.call(this.callbackContext, this.game),
            this.game.context.restore()) : this.onRenderCallback.call(this.callbackContext, this.game)) : this.onLoadRenderCallback && this.onLoadRenderCallback.call(this.callbackContext, this.game)
        },
        destroy: function() {
            this.clearCurrentState(),
            this.callbackContext = null,
            this.onInitCallback = null,
            this.onShutDownCallback = null,
            this.onPreloadCallback = null,
            this.onLoadRenderCallback = null,
            this.onLoadUpdateCallback = null,
            this.onCreateCallback = null,
            this.onUpdateCallback = null,
            this.onRenderCallback = null,
            this.onPausedCallback = null,
            this.onResumedCallback = null,
            this.onPauseUpdateCallback = null,
            this.game = null,
            this.states = {},
            this._pendingState = null,
            this.current = ""
        }
    },
    c.StateManager.prototype.constructor = c.StateManager,
    Object.defineProperty(c.StateManager.prototype, "created", {
        get: function() {
            return this._created
        }
    }),
    c.Signal = function() {}
    ,
    c.Signal.prototype = {
        _bindings: null,
        _prevParams: null,
        memorize: !1,
        _shouldPropagate: !0,
        active: !0,
        _boundDispatch: !0,
        validateListener: function(a, b) {
            if ("function" != typeof a)
                throw new Error("Phaser.Signal: listener is a required param of {fn}() and should be a Function.".replace("{fn}", b))
        },
        _registerListener: function(a, b, d, e, f) {
            var g, h = this._indexOfListener(a, d);
            if (-1 !== h) {
                if (g = this._bindings[h],
                g.isOnce() !== b)
                    throw new Error("You cannot add" + (b ? "" : "Once") + "() then add" + (b ? "Once" : "") + "() the same listener without removing the relationship first.")
            } else
                g = new c.SignalBinding(this,a,b,d,e,f),
                this._addBinding(g);
            return this.memorize && this._prevParams && g.execute(this._prevParams),
            g
        },
        _addBinding: function(a) {
            this._bindings || (this._bindings = []);
            var b = this._bindings.length;
            do
                b--;
            while (this._bindings[b] && a._priority <= this._bindings[b]._priority);
            this._bindings.splice(b + 1, 0, a)
        },
        _indexOfListener: function(a, b) {
            if (!this._bindings)
                return -1;
            void 0 === b && (b = null);
            for (var c, d = this._bindings.length; d--; )
                if (c = this._bindings[d],
                c._listener === a && c.context === b)
                    return d;
            return -1
        },
        has: function(a, b) {
            return -1 !== this._indexOfListener(a, b)
        },
        add: function(a, b, c) {
            this.validateListener(a, "add");
            var d = [];
            if (arguments.length > 3)
                for (var e = 3; e < arguments.length; e++)
                    d.push(arguments[e]);
            return this._registerListener(a, !1, b, c, d)
        },
        addOnce: function(a, b, c) {
            this.validateListener(a, "addOnce");
            var d = [];
            if (arguments.length > 3)
                for (var e = 3; e < arguments.length; e++)
                    d.push(arguments[e]);
            return this._registerListener(a, !0, b, c, d)
        },
        remove: function(a, b) {
            this.validateListener(a, "remove");
            var c = this._indexOfListener(a, b);
            return -1 !== c && (this._bindings[c]._destroy(),
            this._bindings.splice(c, 1)),
            a
        },
        removeAll: function(a) {
            if (void 0 === a && (a = null),
            this._bindings) {
                for (var b = this._bindings.length; b--; )
                    a ? this._bindings[b].context === a && (this._bindings[b]._destroy(),
                    this._bindings.splice(b, 1)) : this._bindings[b]._destroy();
                a || (this._bindings.length = 0)
            }
        },
        getNumListeners: function() {
            return this._bindings ? this._bindings.length : 0
        },
        halt: function() {
            this._shouldPropagate = !1
        },
        dispatch: function() {
            if (this.active && this._bindings) {
                var a, b = Array.prototype.slice.call(arguments), c = this._bindings.length;
                if (this.memorize && (this._prevParams = b),
                c) {
                    a = this._bindings.slice(),
                    this._shouldPropagate = !0;
                    do
                        c--;
                    while (a[c] && this._shouldPropagate && a[c].execute(b) !== !1)
                }
            }
        },
        forget: function() {
            this._prevParams && (this._prevParams = null)
        },
        dispose: function() {
            this.removeAll(),
            this._bindings = null,
            this._prevParams && (this._prevParams = null)
        },
        toString: function() {
            return "[Phaser.Signal active:" + this.active + " numListeners:" + this.getNumListeners() + "]"
        }
    },
    Object.defineProperty(c.Signal.prototype, "boundDispatch", {
        get: function() {
            var a = this;
            return this._boundDispatch || (this._boundDispatch = function() {
                return a.dispatch.apply(a, arguments)
            }
            )
        }
    }),
    c.Signal.prototype.constructor = c.Signal,
    c.SignalBinding = function(a, b, c, d, e, f) {
        this._listener = b,
        c && (this._isOnce = !0),
        null != d && (this.context = d),
        this._signal = a,
        e && (this._priority = e),
        f && f.length && (this._args = f)
    }
    ,
    c.SignalBinding.prototype = {
        context: null,
        _isOnce: !1,
        _priority: 0,
        _args: null,
        callCount: 0,
        active: !0,
        params: null,
        execute: function(a) {
            var b, c;
            return this.active && this._listener && (c = this.params ? this.params.concat(a) : a,
            this._args && (c = c.concat(this._args)),
            b = this._listener.apply(this.context, c),
            this.callCount++,
            this._isOnce && this.detach()),
            b
        },
        detach: function() {
            return this.isBound() ? this._signal.remove(this._listener, this.context) : null
        },
        isBound: function() {
            return !!this._signal && !!this._listener
        },
        isOnce: function() {
            return this._isOnce
        },
        getListener: function() {
            return this._listener
        },
        getSignal: function() {
            return this._signal
        },
        _destroy: function() {
            delete this._signal,
            delete this._listener,
            delete this.context
        },
        toString: function() {
            return "[Phaser.SignalBinding isOnce:" + this._isOnce + ", isBound:" + this.isBound() + ", active:" + this.active + "]"
        }
    },
    c.SignalBinding.prototype.constructor = c.SignalBinding,
    c.Filter = function(a, b, d) {
        this.game = a,
        this.type = c.WEBGL_FILTER,
        this.passes = [this],
        this.shaders = [],
        this.dirty = !0,
        this.padding = 0,
        this.prevPoint = new c.Point;
        var e = new Date;
        if (this.uniforms = {
            resolution: {
                type: "2f",
                value: {
                    x: 256,
                    y: 256
                }
            },
            time: {
                type: "1f",
                value: 0
            },
            mouse: {
                type: "2f",
                value: {
                    x: 0,
                    y: 0
                }
            },
            date: {
                type: "4fv",
                value: [e.getFullYear(), e.getMonth(), e.getDate(), 60 * e.getHours() * 60 + 60 * e.getMinutes() + e.getSeconds()]
            },
            sampleRate: {
                type: "1f",
                value: 44100
            },
            iChannel0: {
                type: "sampler2D",
                value: null,
                textureData: {
                    repeat: !0
                }
            },
            iChannel1: {
                type: "sampler2D",
                value: null,
                textureData: {
                    repeat: !0
                }
            },
            iChannel2: {
                type: "sampler2D",
                value: null,
                textureData: {
                    repeat: !0
                }
            },
            iChannel3: {
                type: "sampler2D",
                value: null,
                textureData: {
                    repeat: !0
                }
            }
        },
        b)
            for (var f in b)
                this.uniforms[f] = b[f];
        this.fragmentSrc = d || ""
    }
    ,
    c.Filter.prototype = {
        init: function() {},
        setResolution: function(a, b) {
            this.uniforms.resolution.value.x = a,
            this.uniforms.resolution.value.y = b
        },
        update: function(a) {
            if ("undefined" != typeof a) {
                var b = a.x / this.game.width
                  , c = 1 - a.y / this.game.height;
                (b !== this.prevPoint.x || c !== this.prevPoint.y) && (this.uniforms.mouse.value.x = b.toFixed(2),
                this.uniforms.mouse.value.y = c.toFixed(2),
                this.prevPoint.set(b, c))
            }
            this.uniforms.time.value = this.game.time.totalElapsedSeconds()
        },
        destroy: function() {
            this.game = null
        }
    },
    c.Filter.prototype.constructor = c.Filter,
    Object.defineProperty(c.Filter.prototype, "width", {
        get: function() {
            return this.uniforms.resolution.value.x
        },
        set: function(a) {
            this.uniforms.resolution.value.x = a
        }
    }),
    Object.defineProperty(c.Filter.prototype, "height", {
        get: function() {
            return this.uniforms.resolution.value.y
        },
        set: function(a) {
            this.uniforms.resolution.value.y = a
        }
    }),
    c.Plugin = function(a, b) {
        void 0 === b && (b = null),
        this.game = a,
        this.parent = b,
        this.active = !1,
        this.visible = !1,
        this.hasPreUpdate = !1,
        this.hasUpdate = !1,
        this.hasPostUpdate = !1,
        this.hasRender = !1,
        this.hasPostRender = !1
    }
    ,
    c.Plugin.prototype = {
        preUpdate: function() {},
        update: function() {},
        render: function() {},
        postRender: function() {},
        destroy: function() {
            this.game = null,
            this.parent = null,
            this.active = !1,
            this.visible = !1
        }
    },
    c.Plugin.prototype.constructor = c.Plugin,
    c.PluginManager = function(a) {
        this.game = a,
        this.plugins = [],
        this._len = 0,
        this._i = 0
    }
    ,
    c.PluginManager.prototype = {
        add: function(a) {
            var b = Array.prototype.splice.call(arguments, 1)
              , c = !1;
            return "function" == typeof a ? a = new a(this.game,this) : (a.game = this.game,
            a.parent = this),
            "function" == typeof a.preUpdate && (a.hasPreUpdate = !0,
            c = !0),
            "function" == typeof a.update && (a.hasUpdate = !0,
            c = !0),
            "function" == typeof a.postUpdate && (a.hasPostUpdate = !0,
            c = !0),
            "function" == typeof a.render && (a.hasRender = !0,
            c = !0),
            "function" == typeof a.postRender && (a.hasPostRender = !0,
            c = !0),
            c ? ((a.hasPreUpdate || a.hasUpdate || a.hasPostUpdate) && (a.active = !0),
            (a.hasRender || a.hasPostRender) && (a.visible = !0),
            this._len = this.plugins.push(a),
            "function" == typeof a.init && a.init.apply(a, b),
            a) : null
        },
        remove: function(a) {
            for (this._i = this._len; this._i--; )
                if (this.plugins[this._i] === a)
                    return a.destroy(),
                    this.plugins.splice(this._i, 1),
                    void this._len--
        },
        removeAll: function() {
            for (this._i = this._len; this._i--; )
                this.plugins[this._i].destroy();
            this.plugins.length = 0,
            this._len = 0
        },
        preUpdate: function() {
            for (this._i = this._len; this._i--; )
                this.plugins[this._i].active && this.plugins[this._i].hasPreUpdate && this.plugins[this._i].preUpdate()
        },
        update: function() {
            for (this._i = this._len; this._i--; )
                this.plugins[this._i].active && this.plugins[this._i].hasUpdate && this.plugins[this._i].update()
        },
        postUpdate: function() {
            for (this._i = this._len; this._i--; )
                this.plugins[this._i].active && this.plugins[this._i].hasPostUpdate && this.plugins[this._i].postUpdate()
        },
        render: function() {
            for (this._i = this._len; this._i--; )
                this.plugins[this._i].visible && this.plugins[this._i].hasRender && this.plugins[this._i].render()
        },
        postRender: function() {
            for (this._i = this._len; this._i--; )
                this.plugins[this._i].visible && this.plugins[this._i].hasPostRender && this.plugins[this._i].postRender()
        },
        destroy: function() {
            this.removeAll(),
            this.game = null
        }
    },
    c.PluginManager.prototype.constructor = c.PluginManager,
    c.Stage = function(a) {
        this.game = a,
        PIXI.Stage.call(this, 0),
        this.name = "_stage_root",
        this.disableVisibilityChange = !1,
        this.exists = !0,
        this.currentRenderOrderID = 0,
        this._hiddenVar = "hidden",
        this._onChange = null,
        this._backgroundColor = 0,
        a.config && this.parseConfig(a.config)
    }
    ,
    c.Stage.prototype = Object.create(PIXI.Stage.prototype),
    c.Stage.prototype.constructor = c.Stage,
    c.Stage.prototype.parseConfig = function(a) {
        a.disableVisibilityChange && (this.disableVisibilityChange = a.disableVisibilityChange),
        a.backgroundColor && (this.backgroundColor = a.backgroundColor)
    }
    ,
    c.Stage.prototype.boot = function() {
        c.DOM.getOffset(this.game.canvas, this.offset),
        c.Canvas.setUserSelect(this.game.canvas, "none"),
        c.Canvas.setTouchAction(this.game.canvas, "none"),
        this.checkVisibility()
    }
    ,
    c.Stage.prototype.preUpdate = function() {
        this.currentRenderOrderID = 0;
        for (var a = 0; a < this.children.length; a++)
            this.children[a].preUpdate()
    }
    ,
    c.Stage.prototype.update = function() {
        for (var a = this.children.length; a--; )
            this.children[a].update()
    }
    ,
    c.Stage.prototype.postUpdate = function() {
        if (this.game.world.camera.target) {
            this.game.world.camera.target.postUpdate(),
            this.game.world.camera.update();
            for (var a = this.children.length; a--; )
                this.children[a] !== this.game.world.camera.target && this.children[a].postUpdate()
        } else {
            this.game.world.camera.update();
            for (var a = this.children.length; a--; )
                this.children[a].postUpdate()
        }
    }
    ,
    c.Stage.prototype.updateTransform = function() {
        this.worldAlpha = 1;
        for (var a = 0; a < this.children.length; a++)
            this.children[a].updateTransform()
    }
    ,
    c.Stage.prototype.checkVisibility = function() {
        this._hiddenVar = void 0 !== document.webkitHidden ? "webkitvisibilitychange" : void 0 !== document.mozHidden ? "mozvisibilitychange" : void 0 !== document.msHidden ? "msvisibilitychange" : void 0 !== document.hidden ? "visibilitychange" : null;
        var a = this;
        this._onChange = function(b) {
            return a.visibilityChange(b)
        }
        ,
        this._hiddenVar && document.addEventListener(this._hiddenVar, this._onChange, !1),
        window.onblur = this._onChange,
        window.onfocus = this._onChange,
        window.onpagehide = this._onChange,
        window.onpageshow = this._onChange,
        this.game.device.cocoonJSApp && (CocoonJS.App.onSuspended.addEventListener(function() {
            c.Stage.prototype.visibilityChange.call(a, {
                type: "pause"
            })
        }),
        CocoonJS.App.onActivated.addEventListener(function() {
            c.Stage.prototype.visibilityChange.call(a, {
                type: "resume"
            })
        }))
    }
    ,
    c.Stage.prototype.visibilityChange = function(a) {
        return "pagehide" === a.type || "blur" === a.type || "pageshow" === a.type || "focus" === a.type ? void ("pagehide" === a.type || "blur" === a.type ? this.game.focusLoss(a) : ("pageshow" === a.type || "focus" === a.type) && this.game.focusGain(a)) : void (this.disableVisibilityChange || (document.hidden || document.mozHidden || document.msHidden || document.webkitHidden || "pause" === a.type ? this.game.gamePaused(a) : this.game.gameResumed(a)))
    }
    ,
    c.Stage.prototype.setBackgroundColor = function(a) {
        var b = c.Color.valueToColor(a);
        this._backgroundColor = c.Color.getColor(b.r, b.g, b.b),
        this.backgroundColorSplit = [b.r / 255, b.g / 255, b.b / 255],
        this.backgroundColorString = c.Color.RGBtoString(b.r, b.g, b.b, 255, "#")
    }
    ,
    c.Stage.prototype.destroy = function() {
        this._hiddenVar && document.removeEventListener(this._hiddenVar, this._onChange, !1),
        window.onpagehide = null,
        window.onpageshow = null,
        window.onblur = null,
        window.onfocus = null
    }
    ,
    Object.defineProperty(c.Stage.prototype, "backgroundColor", {
        get: function() {
            return this._backgroundColor
        },
        set: function(a) {
            this.game.transparent || this.setBackgroundColor(a)
        }
    }),
    Object.defineProperty(c.Stage.prototype, "smoothed", {
        get: function() {
            return PIXI.scaleModes.DEFAULT === PIXI.scaleModes.LINEAR
        },
        set: function(a) {
            PIXI.scaleModes.DEFAULT = a ? PIXI.scaleModes.LINEAR : PIXI.scaleModes.NEAREST
        }
    }),
    c.Group = function(a, b, d, e, f, g) {
        void 0 === e && (e = !1),
        void 0 === f && (f = !1),
        void 0 === g && (g = c.Physics.ARCADE),
        this.game = a,
        void 0 === b && (b = a.world),
        this.name = d || "group",
        this.z = 0,
        PIXI.DisplayObjectContainer.call(this),
        e ? (this.game.stage.addChild(this),
        this.z = this.game.stage.children.length) : b && (b.addChild(this),
        this.z = b.children.length),
        this.type = c.GROUP,
        this.physicsType = c.GROUP,
        this.alive = !0,
        this.exists = !0,
        this.ignoreDestroy = !1,
        this.pendingDestroy = !1,
        this.classType = c.Sprite,
        this.cursor = null,
        this.enableBody = f,
        this.enableBodyDebug = !1,
        this.physicsBodyType = g,
        this.physicsSortDirection = null,
        this.onDestroy = new c.Signal,
        this.cursorIndex = 0,
        this.fixedToCamera = !1,
        this.cameraOffset = new c.Point,
        this.hash = [],
        this._sortProperty = "z"
    }
    ,
    c.Group.prototype = Object.create(PIXI.DisplayObjectContainer.prototype),
    c.Group.prototype.constructor = c.Group,
    c.Group.RETURN_NONE = 0,
    c.Group.RETURN_TOTAL = 1,
    c.Group.RETURN_CHILD = 2,
    c.Group.SORT_ASCENDING = -1,
    c.Group.SORT_DESCENDING = 1,
    c.Group.prototype.add = function(a, b) {
        return void 0 === b && (b = !1),
        a.parent !== this && (this.addChild(a),
        a.z = this.children.length,
        this.enableBody && null === a.body ? this.game.physics.enable(a, this.physicsBodyType) : a.body && this.addToHash(a),
        !b && a.events && a.events.onAddedToGroup$dispatch(a, this),
        null === this.cursor && (this.cursor = a)),
        a
    }
    ,
    c.Group.prototype.addToHash = function(a) {
        if (a.parent === this) {
            var b = this.hash.indexOf(a);
            if (-1 === b)
                return this.hash.push(a),
                !0
        }
        return !1
    }
    ,
    c.Group.prototype.removeFromHash = function(a) {
        if (a) {
            var b = this.hash.indexOf(a);
            if (-1 !== b)
                return this.hash.splice(b, 1),
                !0
        }
        return !1
    }
    ,
    c.Group.prototype.addMultiple = function(a, b) {
        if (a instanceof c.Group)
            a.moveAll(this, b);
        else if (Array.isArray(a))
            for (var d = 0; d < a.length; d++)
                this.add(a[d], b);
        return a
    }
    ,
    c.Group.prototype.addAt = function(a, b, c) {
        return void 0 === c && (c = !1),
        a.parent !== this && (this.addChildAt(a, b),
        this.updateZ(),
        this.enableBody && null === a.body ? this.game.physics.enable(a, this.physicsBodyType) : a.body && this.addToHash(a),
        !c && a.events && a.events.onAddedToGroup$dispatch(a, this),
        null === this.cursor && (this.cursor = a)),
        a
    }
    ,
    c.Group.prototype.getAt = function(a) {
        return 0 > a || a >= this.children.length ? -1 : this.getChildAt(a)
    }
    ,
    c.Group.prototype.create = function(a, b, c, d, e) {
        void 0 === e && (e = !0);
        var f = new this.classType(this.game,a,b,c,d);
        return f.exists = e,
        f.visible = e,
        f.alive = e,
        this.addChild(f),
        f.z = this.children.length,
        this.enableBody && this.game.physics.enable(f, this.physicsBodyType, this.enableBodyDebug),
        f.events && f.events.onAddedToGroup$dispatch(f, this),
        null === this.cursor && (this.cursor = f),
        f
    }
    ,
    c.Group.prototype.createMultiple = function(a, b, c, d) {
        void 0 === d && (d = !1);
        for (var e = 0; a > e; e++)
            this.create(0, 0, b, c, d)
    }
    ,
    c.Group.prototype.updateZ = function() {
        for (var a = this.children.length; a--; )
            this.children[a].z = a
    }
    ,
    c.Group.prototype.resetCursor = function(a) {
        return void 0 === a && (a = 0),
        a > this.children.length - 1 && (a = 0),
        this.cursor ? (this.cursorIndex = a,
        this.cursor = this.children[this.cursorIndex],
        this.cursor) : void 0
    }
    ,
    c.Group.prototype.next = function() {
        return this.cursor ? (this.cursorIndex >= this.children.length - 1 ? this.cursorIndex = 0 : this.cursorIndex++,
        this.cursor = this.children[this.cursorIndex],
        this.cursor) : void 0
    }
    ,
    c.Group.prototype.previous = function() {
        return this.cursor ? (0 === this.cursorIndex ? this.cursorIndex = this.children.length - 1 : this.cursorIndex--,
        this.cursor = this.children[this.cursorIndex],
        this.cursor) : void 0
    }
    ,
    c.Group.prototype.swap = function(a, b) {
        this.swapChildren(a, b),
        this.updateZ()
    }
    ,
    c.Group.prototype.bringToTop = function(a) {
        return a.parent === this && this.getIndex(a) < this.children.length && (this.remove(a, !1, !0),
        this.add(a, !0)),
        a
    }
    ,
    c.Group.prototype.sendToBack = function(a) {
        return a.parent === this && this.getIndex(a) > 0 && (this.remove(a, !1, !0),
        this.addAt(a, 0, !0)),
        a
    }
    ,
    c.Group.prototype.moveUp = function(a) {
        if (a.parent === this && this.getIndex(a) < this.children.length - 1) {
            var b = this.getIndex(a)
              , c = this.getAt(b + 1);
            c && this.swap(a, c)
        }
        return a
    }
    ,
    c.Group.prototype.moveDown = function(a) {
        if (a.parent === this && this.getIndex(a) > 0) {
            var b = this.getIndex(a)
              , c = this.getAt(b - 1);
            c && this.swap(a, c)
        }
        return a
    }
    ,
    c.Group.prototype.xy = function(a, b, c) {
        return 0 > a || a > this.children.length ? -1 : (this.getChildAt(a).x = b,
        void (this.getChildAt(a).y = c))
    }
    ,
    c.Group.prototype.reverse = function() {
        this.children.reverse(),
        this.updateZ()
    }
    ,
    c.Group.prototype.getIndex = function(a) {
        return this.children.indexOf(a)
    }
    ,
    c.Group.prototype.replace = function(a, b) {
        var d = this.getIndex(a);
        return -1 !== d ? (b.parent && (b.parent instanceof c.Group ? b.parent.remove(b) : b.parent.removeChild(b)),
        this.remove(a),
        this.addAt(b, d),
        a) : void 0
    }
    ,
    c.Group.prototype.hasProperty = function(a, b) {
        var c = b.length;
        return 1 === c && b[0]in a ? !0 : 2 === c && b[0]in a && b[1]in a[b[0]] ? !0 : 3 === c && b[0]in a && b[1]in a[b[0]] && b[2]in a[b[0]][b[1]] ? !0 : 4 === c && b[0]in a && b[1]in a[b[0]] && b[2]in a[b[0]][b[1]] && b[3]in a[b[0]][b[1]][b[2]] ? !0 : !1
    }
    ,
    c.Group.prototype.setProperty = function(a, b, c, d, e) {
        if (void 0 === e && (e = !1),
        d = d || 0,
        !this.hasProperty(a, b) && (!e || d > 0))
            return !1;
        var f = b.length;
        return 1 === f ? 0 === d ? a[b[0]] = c : 1 == d ? a[b[0]] += c : 2 == d ? a[b[0]] -= c : 3 == d ? a[b[0]] *= c : 4 == d && (a[b[0]] /= c) : 2 === f ? 0 === d ? a[b[0]][b[1]] = c : 1 == d ? a[b[0]][b[1]] += c : 2 == d ? a[b[0]][b[1]] -= c : 3 == d ? a[b[0]][b[1]] *= c : 4 == d && (a[b[0]][b[1]] /= c) : 3 === f ? 0 === d ? a[b[0]][b[1]][b[2]] = c : 1 == d ? a[b[0]][b[1]][b[2]] += c : 2 == d ? a[b[0]][b[1]][b[2]] -= c : 3 == d ? a[b[0]][b[1]][b[2]] *= c : 4 == d && (a[b[0]][b[1]][b[2]] /= c) : 4 === f && (0 === d ? a[b[0]][b[1]][b[2]][b[3]] = c : 1 == d ? a[b[0]][b[1]][b[2]][b[3]] += c : 2 == d ? a[b[0]][b[1]][b[2]][b[3]] -= c : 3 == d ? a[b[0]][b[1]][b[2]][b[3]] *= c : 4 == d && (a[b[0]][b[1]][b[2]][b[3]] /= c)),
        !0
    }
    ,
    c.Group.prototype.checkProperty = function(a, b, d, e) {
        return void 0 === e && (e = !1),
        !c.Utils.getProperty(a, b) && e ? !1 : c.Utils.getProperty(a, b) !== d ? !1 : !0
    }
    ,
    c.Group.prototype.set = function(a, b, c, d, e, f, g) {
        return void 0 === g && (g = !1),
        b = b.split("."),
        void 0 === d && (d = !1),
        void 0 === e && (e = !1),
        (d === !1 || d && a.alive) && (e === !1 || e && a.visible) ? this.setProperty(a, b, c, f, g) : void 0
    }
    ,
    c.Group.prototype.setAll = function(a, b, c, d, e, f) {
        void 0 === c && (c = !1),
        void 0 === d && (d = !1),
        void 0 === f && (f = !1),
        a = a.split("."),
        e = e || 0;
        for (var g = 0; g < this.children.length; g++)
            (!c || c && this.children[g].alive) && (!d || d && this.children[g].visible) && this.setProperty(this.children[g], a, b, e, f)
    }
    ,
    c.Group.prototype.setAllChildren = function(a, b, d, e, f, g) {
        void 0 === d && (d = !1),
        void 0 === e && (e = !1),
        void 0 === g && (g = !1),
        f = f || 0;
        for (var h = 0; h < this.children.length; h++)
            (!d || d && this.children[h].alive) && (!e || e && this.children[h].visible) && (this.children[h]instanceof c.Group ? this.children[h].setAllChildren(a, b, d, e, f, g) : this.setProperty(this.children[h], a.split("."), b, f, g))
    }
    ,
    c.Group.prototype.checkAll = function(a, b, c, d, e) {
        void 0 === c && (c = !1),
        void 0 === d && (d = !1),
        void 0 === e && (e = !1);
        for (var f = 0; f < this.children.length; f++)
            if ((!c || c && this.children[f].alive) && (!d || d && this.children[f].visible) && !this.checkProperty(this.children[f], a, b, e))
                return !1;
        return !0
    }
    ,
    c.Group.prototype.addAll = function(a, b, c, d) {
        this.setAll(a, b, c, d, 1)
    }
    ,
    c.Group.prototype.subAll = function(a, b, c, d) {
        this.setAll(a, b, c, d, 2)
    }
    ,
    c.Group.prototype.multiplyAll = function(a, b, c, d) {
        this.setAll(a, b, c, d, 3)
    }
    ,
    c.Group.prototype.divideAll = function(a, b, c, d) {
        this.setAll(a, b, c, d, 4)
    }
    ,
    c.Group.prototype.callAllExists = function(a, b) {
        var c;
        if (arguments.length > 2) {
            c = [];
            for (var d = 2; d < arguments.length; d++)
                c.push(arguments[d])
        }
        for (var d = 0; d < this.children.length; d++)
            this.children[d].exists === b && this.children[d][a] && this.children[d][a].apply(this.children[d], c)
    }
    ,
    c.Group.prototype.callbackFromArray = function(a, b, c) {
        if (1 == c) {
            if (a[b[0]])
                return a[b[0]]
        } else if (2 == c) {
            if (a[b[0]][b[1]])
                return a[b[0]][b[1]]
        } else if (3 == c) {
            if (a[b[0]][b[1]][b[2]])
                return a[b[0]][b[1]][b[2]]
        } else if (4 == c) {
            if (a[b[0]][b[1]][b[2]][b[3]])
                return a[b[0]][b[1]][b[2]][b[3]]
        } else if (a[b])
            return a[b];
        return !1
    }
    ,
    c.Group.prototype.callAll = function(a, b) {
        if (void 0 !== a) {
            a = a.split(".");
            var c = a.length;
            if (void 0 === b || null === b || "" === b)
                b = null;
            else if ("string" == typeof b) {
                b = b.split(".");
                var d = b.length
            }
            var e;
            if (arguments.length > 2) {
                e = [];
                for (var f = 2; f < arguments.length; f++)
                    e.push(arguments[f])
            }
            for (var g = null, h = null, f = 0; f < this.children.length; f++)
                g = this.callbackFromArray(this.children[f], a, c),
                b && g ? (h = this.callbackFromArray(this.children[f], b, d),
                g && g.apply(h, e)) : g && g.apply(this.children[f], e)
        }
    }
    ,
    c.Group.prototype.preUpdate = function() {
        if (this.pendingDestroy)
            return this.destroy(),
            !1;
        if (!this.exists || !this.parent.exists)
            return this.renderOrderID = -1,
            !1;
        for (var a = this.children.length; a--; )
            this.children[a].preUpdate();
        return !0
    }
    ,
    c.Group.prototype.update = function() {
        for (var a = this.children.length; a--; )
            this.children[a].update()
    }
    ,
    c.Group.prototype.postUpdate = function() {
        this.fixedToCamera && (this.x = this.game.camera.view.x + this.cameraOffset.x,
        this.y = this.game.camera.view.y + this.cameraOffset.y);
        for (var a = this.children.length; a--; )
            this.children[a].postUpdate()
    }
    ,
    c.Group.prototype.filter = function(a, b) {
        for (var d = -1, e = this.children.length, f = []; ++d < e; ) {
            var g = this.children[d];
            (!b || b && g.exists) && a(g, d, this.children) && f.push(g)
        }
        return new c.ArraySet(f)
    }
    ,
    c.Group.prototype.forEach = function(a, b, c) {
        if (void 0 === c && (c = !1),
        arguments.length <= 3)
            for (var d = 0; d < this.children.length; d++)
                (!c || c && this.children[d].exists) && a.call(b, this.children[d]);
        else {
            for (var e = [null], d = 3; d < arguments.length; d++)
                e.push(arguments[d]);
            for (var d = 0; d < this.children.length; d++)
                (!c || c && this.children[d].exists) && (e[0] = this.children[d],
                a.apply(b, e))
        }
    }
    ,
    c.Group.prototype.forEachExists = function(a, b) {
        var d;
        if (arguments.length > 2) {
            d = [null];
            for (var e = 2; e < arguments.length; e++)
                d.push(arguments[e])
        }
        this.iterate("exists", !0, c.Group.RETURN_TOTAL, a, b, d)
    }
    ,
    c.Group.prototype.forEachAlive = function(a, b) {
        var d;
        if (arguments.length > 2) {
            d = [null];
            for (var e = 2; e < arguments.length; e++)
                d.push(arguments[e])
        }
        this.iterate("alive", !0, c.Group.RETURN_TOTAL, a, b, d)
    }
    ,
    c.Group.prototype.forEachDead = function(a, b) {
        var d;
        if (arguments.length > 2) {
            d = [null];
            for (var e = 2; e < arguments.length; e++)
                d.push(arguments[e])
        }
        this.iterate("alive", !1, c.Group.RETURN_TOTAL, a, b, d)
    }
    ,
    c.Group.prototype.sort = function(a, b) {
        this.children.length < 2 || (void 0 === a && (a = "z"),
        void 0 === b && (b = c.Group.SORT_ASCENDING),
        this._sortProperty = a,
        this.children.sort(b === c.Group.SORT_ASCENDING ? this.ascendingSortHandler.bind(this) : this.descendingSortHandler.bind(this)),
        this.updateZ())
    }
    ,
    c.Group.prototype.customSort = function(a, b) {
        this.children.length < 2 || (this.children.sort(a.bind(b)),
        this.updateZ())
    }
    ,
    c.Group.prototype.ascendingSortHandler = function(a, b) {
        return a[this._sortProperty] < b[this._sortProperty] ? -1 : a[this._sortProperty] > b[this._sortProperty] ? 1 : a.z < b.z ? -1 : 1
    }
    ,
    c.Group.prototype.descendingSortHandler = function(a, b) {
        return a[this._sortProperty] < b[this._sortProperty] ? 1 : a[this._sortProperty] > b[this._sortProperty] ? -1 : 0
    }
    ,
    c.Group.prototype.iterate = function(a, b, d, e, f, g) {
        if (d === c.Group.RETURN_TOTAL && 0 === this.children.length)
            return 0;
        for (var h = 0, i = 0; i < this.children.length; i++)
            if (this.children[i][a] === b && (h++,
            e && (g ? (g[0] = this.children[i],
            e.apply(f, g)) : e.call(f, this.children[i])),
            d === c.Group.RETURN_CHILD))
                return this.children[i];
        return d === c.Group.RETURN_TOTAL ? h : null
    }
    ,
    c.Group.prototype.getFirstExists = function(a) {
        return "boolean" != typeof a && (a = !0),
        this.iterate("exists", a, c.Group.RETURN_CHILD)
    }
    ,
    c.Group.prototype.getFirstAlive = function() {
        return this.iterate("alive", !0, c.Group.RETURN_CHILD)
    }
    ,
    c.Group.prototype.getFirstDead = function() {
        return this.iterate("alive", !1, c.Group.RETURN_CHILD)
    }
    ,
    c.Group.prototype.getTop = function() {
        return this.children.length > 0 ? this.children[this.children.length - 1] : void 0
    }
    ,
    c.Group.prototype.getBottom = function() {
        return this.children.length > 0 ? this.children[0] : void 0
    }
    ,
    c.Group.prototype.countLiving = function() {
        return this.iterate("alive", !0, c.Group.RETURN_TOTAL)
    }
    ,
    c.Group.prototype.countDead = function() {
        return this.iterate("alive", !1, c.Group.RETURN_TOTAL)
    }
    ,
    c.Group.prototype.getRandom = function(a, b) {
        return 0 === this.children.length ? null : (a = a || 0,
        b = b || this.children.length,
        c.ArrayUtils.getRandomItem(this.children, a, b))
    }
    ,
    c.Group.prototype.remove = function(a, b, c) {
        if (void 0 === b && (b = !1),
        void 0 === c && (c = !1),
        0 === this.children.length || -1 === this.children.indexOf(a))
            return !1;
        c || !a.events || a.destroyPhase || a.events.onRemovedFromGroup$dispatch(a, this);
        var d = this.removeChild(a);
        return this.removeFromHash(a),
        this.updateZ(),
        this.cursor === a && this.next(),
        b && d && d.destroy(!0),
        !0
    }
    ,
    c.Group.prototype.moveAll = function(a, b) {
        if (void 0 === b && (b = !1),
        this.children.length > 0 && a instanceof c.Group) {
            do
                a.add(this.children[0], b);
            while (this.children.length > 0);
            this.hash = [],
            this.cursor = null
        }
        return a
    }
    ,
    c.Group.prototype.removeAll = function(a, b) {
        if (void 0 === a && (a = !1),
        void 0 === b && (b = !1),
        0 !== this.children.length) {
            do {
                !b && this.children[0].events && this.children[0].events.onRemovedFromGroup$dispatch(this.children[0], this);
                var c = this.removeChild(this.children[0]);
                this.removeFromHash(c),
                a && c && c.destroy(!0)
            } while (this.children.length > 0);
            this.hash = [],
            this.cursor = null
        }
    }
    ,
    c.Group.prototype.removeBetween = function(a, b, c, d) {
        if (void 0 === b && (b = this.children.length - 1),
        void 0 === c && (c = !1),
        void 0 === d && (d = !1),
        0 !== this.children.length) {
            if (a > b || 0 > a || b > this.children.length)
                return !1;
            for (var e = b; e >= a; ) {
                !d && this.children[e].events && this.children[e].events.onRemovedFromGroup$dispatch(this.children[e], this);
                var f = this.removeChild(this.children[e]);
                this.removeFromHash(f),
                c && f && f.destroy(!0),
                this.cursor === this.children[e] && (this.cursor = null),
                e--
            }
            this.updateZ()
        }
    }
    ,
    c.Group.prototype.destroy = function(a, b) {
        null === this.game || this.ignoreDestroy || (void 0 === a && (a = !0),
        void 0 === b && (b = !1),
        this.onDestroy.dispatch(this, a, b),
        this.removeAll(a),
        this.cursor = null,
        this.filters = null,
        this.pendingDestroy = !1,
        b || (this.parent && this.parent.removeChild(this),
        this.game = null,
        this.exists = !1))
    }
    ,
    Object.defineProperty(c.Group.prototype, "total", {
        get: function() {
            return this.iterate("exists", !0, c.Group.RETURN_TOTAL)
        }
    }),
    Object.defineProperty(c.Group.prototype, "length", {
        get: function() {
            return this.children.length
        }
    }),
    Object.defineProperty(c.Group.prototype, "angle", {
        get: function() {
            return c.Math.radToDeg(this.rotation)
        },
        set: function(a) {
            this.rotation = c.Math.degToRad(a)
        }
    }),
    c.World = function(a) {
        c.Group.call(this, a, null, "__world", !1),
        this.bounds = new c.Rectangle(0,0,a.width,a.height),
        this.camera = null,
        this._definedSize = !1,
        this._width = a.width,
        this._height = a.height,
        this.game.state.onStateChange.add(this.stateChange, this)
    }
    ,
    c.World.prototype = Object.create(c.Group.prototype),
    c.World.prototype.constructor = c.World,
    c.World.prototype.boot = function() {
        this.camera = new c.Camera(this.game,0,0,0,this.game.width,this.game.height),
        this.camera.displayObject = this,
        this.camera.scale = this.scale,
        this.game.camera = this.camera,
        this.game.stage.addChild(this)
    }
    ,
    c.World.prototype.stateChange = function() {
        this.x = 0,
        this.y = 0,
        this.camera.reset()
    }
    ,
    c.World.prototype.setBounds = function(a, b, c, d) {
        this._definedSize = !0,
        this._width = c,
        this._height = d,
        this.bounds.setTo(a, b, c, d),
        this.x = a,
        this.y = b,
        this.camera.bounds && this.camera.bounds.setTo(a, b, Math.max(c, this.game.width), Math.max(d, this.game.height)),
        this.game.physics.setBoundsToWorld()
    }
    ,
    c.World.prototype.resize = function(a, b) {
        this._definedSize && (a < this._width && (a = this._width),
        b < this._height && (b = this._height)),
        this.bounds.width = a,
        this.bounds.height = b,
        this.game.camera.setBoundsToWorld(),
        this.game.physics.setBoundsToWorld()
    }
    ,
    c.World.prototype.shutdown = function() {
        this.destroy(!0, !0)
    }
    ,
    c.World.prototype.wrap = function(a, b, c, d, e) {
        void 0 === b && (b = 0),
        void 0 === c && (c = !1),
        void 0 === d && (d = !0),
        void 0 === e && (e = !0),
        c ? (a.getBounds(),
        d && (a.x + a._currentBounds.width < this.bounds.x ? a.x = this.bounds.right : a.x > this.bounds.right && (a.x = this.bounds.left)),
        e && (a.y + a._currentBounds.height < this.bounds.top ? a.y = this.bounds.bottom : a.y > this.bounds.bottom && (a.y = this.bounds.top))) : (d && a.x + b < this.bounds.x ? a.x = this.bounds.right + b : d && a.x - b > this.bounds.right && (a.x = this.bounds.left - b),
        e && a.y + b < this.bounds.top ? a.y = this.bounds.bottom + b : e && a.y - b > this.bounds.bottom && (a.y = this.bounds.top - b))
    }
    ,
    Object.defineProperty(c.World.prototype, "width", {
        get: function() {
            return this.bounds.width
        },
        set: function(a) {
            a < this.game.width && (a = this.game.width),
            this.bounds.width = a,
            this._width = a,
            this._definedSize = !0
        }
    }),
    Object.defineProperty(c.World.prototype, "height", {
        get: function() {
            return this.bounds.height
        },
        set: function(a) {
            a < this.game.height && (a = this.game.height),
            this.bounds.height = a,
            this._height = a,
            this._definedSize = !0
        }
    }),
    Object.defineProperty(c.World.prototype, "centerX", {
        get: function() {
            return this.bounds.halfWidth
        }
    }),
    Object.defineProperty(c.World.prototype, "centerY", {
        get: function() {
            return this.bounds.halfHeight
        }
    }),
    Object.defineProperty(c.World.prototype, "randomX", {
        get: function() {
            return this.bounds.x < 0 ? this.game.rnd.between(this.bounds.x, this.bounds.width - Math.abs(this.bounds.x)) : this.game.rnd.between(this.bounds.x, this.bounds.width)
        }
    }),
    Object.defineProperty(c.World.prototype, "randomY", {
        get: function() {
            return this.bounds.y < 0 ? this.game.rnd.between(this.bounds.y, this.bounds.height - Math.abs(this.bounds.y)) : this.game.rnd.between(this.bounds.y, this.bounds.height)
        }
    }),
    c.FlexGrid = function(a, b, d) {
        this.game = a.game,
        this.manager = a,
        this.width = b,
        this.height = d,
        this.boundsCustom = new c.Rectangle(0,0,b,d),
        this.boundsFluid = new c.Rectangle(0,0,b,d),
        this.boundsFull = new c.Rectangle(0,0,b,d),
        this.boundsNone = new c.Rectangle(0,0,b,d),
        this.positionCustom = new c.Point(0,0),
        this.positionFluid = new c.Point(0,0),
        this.positionFull = new c.Point(0,0),
        this.positionNone = new c.Point(0,0),
        this.scaleCustom = new c.Point(1,1),
        this.scaleFluid = new c.Point(1,1),
        this.scaleFluidInversed = new c.Point(1,1),
        this.scaleFull = new c.Point(1,1),
        this.scaleNone = new c.Point(1,1),
        this.customWidth = 0,
        this.customHeight = 0,
        this.customOffsetX = 0,
        this.customOffsetY = 0,
        this.ratioH = b / d,
        this.ratioV = d / b,
        this.multiplier = 0,
        this.layers = []
    }
    ,
    c.FlexGrid.prototype = {
        setSize: function(a, b) {
            this.width = a,
            this.height = b,
            this.ratioH = a / b,
            this.ratioV = b / a,
            this.scaleNone = new c.Point(1,1),
            this.boundsNone.width = this.width,
            this.boundsNone.height = this.height,
            this.refresh()
        },
        createCustomLayer: function(a, b, d, e) {
            void 0 === e && (e = !0),
            this.customWidth = a,
            this.customHeight = b,
            this.boundsCustom.width = a,
            this.boundsCustom.height = b;
            var f = new c.FlexLayer(this,this.positionCustom,this.boundsCustom,this.scaleCustom);
            return e && this.game.world.add(f),
            this.layers.push(f),
            "undefined" != typeof d && null !== typeof d && f.addMultiple(d),
            f
        },
        createFluidLayer: function(a, b) {
            void 0 === b && (b = !0);
            var d = new c.FlexLayer(this,this.positionFluid,this.boundsFluid,this.scaleFluid);
            return b && this.game.world.add(d),
            this.layers.push(d),
            "undefined" != typeof a && null !== typeof a && d.addMultiple(a),
            d
        },
        createFullLayer: function(a) {
            var b = new c.FlexLayer(this,this.positionFull,this.boundsFull,this.scaleFluid);
            return this.game.world.add(b),
            this.layers.push(b),
            "undefined" != typeof a && b.addMultiple(a),
            b
        },
        createFixedLayer: function(a) {
            var b = new c.FlexLayer(this,this.positionNone,this.boundsNone,this.scaleNone);
            return this.game.world.add(b),
            this.layers.push(b),
            "undefined" != typeof a && b.addMultiple(a),
            b
        },
        reset: function() {
            for (var a = this.layers.length; a--; )
                this.layers[a].persist || (this.layers[a].position = null,
                this.layers[a].scale = null,
                this.layers.slice(a, 1))
        },
        onResize: function(a, b) {
            this.ratioH = a / b,
            this.ratioV = b / a,
            this.refresh(a, b)
        },
        refresh: function() {
            this.multiplier = Math.min(this.manager.height / this.height, this.manager.width / this.width),
            this.boundsFluid.width = Math.round(this.width * this.multiplier),
            this.boundsFluid.height = Math.round(this.height * this.multiplier),
            this.scaleFluid.set(this.boundsFluid.width / this.width, this.boundsFluid.height / this.height),
            this.scaleFluidInversed.set(this.width / this.boundsFluid.width, this.height / this.boundsFluid.height),
            this.scaleFull.set(this.boundsFull.width / this.width, this.boundsFull.height / this.height),
            this.boundsFull.width = Math.round(this.manager.width * this.scaleFluidInversed.x),
            this.boundsFull.height = Math.round(this.manager.height * this.scaleFluidInversed.y),
            this.boundsFluid.centerOn(this.manager.bounds.centerX, this.manager.bounds.centerY),
            this.boundsNone.centerOn(this.manager.bounds.centerX, this.manager.bounds.centerY),
            this.positionFluid.set(this.boundsFluid.x, this.boundsFluid.y),
            this.positionNone.set(this.boundsNone.x, this.boundsNone.y)
        },
        fitSprite: function(a) {
            this.manager.scaleSprite(a),
            a.x = this.manager.bounds.centerX,
            a.y = this.manager.bounds.centerY
        },
        debug: function() {
            this.game.debug.text(this.boundsFluid.width + " x " + this.boundsFluid.height, this.boundsFluid.x + 4, this.boundsFluid.y + 16),
            this.game.debug.geom(this.boundsFluid, "rgba(255,0,0,0.9", !1)
        }
    },
    c.FlexGrid.prototype.constructor = c.FlexGrid,
    c.FlexLayer = function(a, b, d, e) {
        c.Group.call(this, a.game, null, "__flexLayer" + a.game.rnd.uuid(), !1),
        this.manager = a.manager,
        this.grid = a,
        this.persist = !1,
        this.position = b,
        this.bounds = d,
        this.scale = e,
        this.topLeft = d.topLeft,
        this.topMiddle = new c.Point(d.halfWidth,0),
        this.topRight = d.topRight,
        this.bottomLeft = d.bottomLeft,
        this.bottomMiddle = new c.Point(d.halfWidth,d.bottom),
        this.bottomRight = d.bottomRight
    }
    ,
    c.FlexLayer.prototype = Object.create(c.Group.prototype),
    c.FlexLayer.prototype.constructor = c.FlexLayer,
    c.FlexLayer.prototype.resize = function() {}
    ,
    c.FlexLayer.prototype.debug = function() {
        this.game.debug.text(this.bounds.width + " x " + this.bounds.height, this.bounds.x + 4, this.bounds.y + 16),
        this.game.debug.geom(this.bounds, "rgba(0,0,255,0.9", !1),
        this.game.debug.geom(this.topLeft, "rgba(255,255,255,0.9"),
        this.game.debug.geom(this.topMiddle, "rgba(255,255,255,0.9"),
        this.game.debug.geom(this.topRight, "rgba(255,255,255,0.9")
    }
    ,
    c.ScaleManager = function(a, b, d) {
        this.game = a,
        this.dom = c.DOM,
        this.grid = null,
        this.width = 0,
        this.height = 0,
        this.minWidth = null,
        this.maxWidth = null,
        this.minHeight = null,
        this.maxHeight = null,
        this.offset = new c.Point,
        this.forceLandscape = !1,
        this.forcePortrait = !1,
        this.incorrectOrientation = !1,
        this._pageAlignHorizontally = !1,
        this._pageAlignVertically = !1,
        this.onOrientationChange = new c.Signal,
        this.enterIncorrectOrientation = new c.Signal,
        this.leaveIncorrectOrientation = new c.Signal,
        this.fullScreenTarget = null,
        this._createdFullScreenTarget = null,
        this.onFullScreenInit = new c.Signal,
        this.onFullScreenChange = new c.Signal,
        this.onFullScreenError = new c.Signal,
        this.screenOrientation = this.dom.getScreenOrientation(),
        this.scaleFactor = new c.Point(1,1),
        this.scaleFactorInversed = new c.Point(1,1),
        this.margin = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            x: 0,
            y: 0
        },
        this.bounds = new c.Rectangle,
        this.aspectRatio = 0,
        this.sourceAspectRatio = 0,
        this.event = null,
        this.windowConstraints = {
            right: "layout",
            bottom: ""
        },
        this.compatibility = {
            supportsFullScreen: !1,
            orientationFallback: null,
            noMargins: !1,
            scrollTo: null,
            forceMinimumDocumentHeight: !1,
            canExpandParent: !0,
            clickTrampoline: ""
        },
        this._scaleMode = c.ScaleManager.NO_SCALE,
        this._fullScreenScaleMode = c.ScaleManager.NO_SCALE,
        this.parentIsWindow = !1,
        this.parentNode = null,
        this.parentScaleFactor = new c.Point(1,1),
        this.trackParentInterval = 2e3,
        this.onSizeChange = new c.Signal,
        this.onResize = null,
        this.onResizeContext = null,
        this._pendingScaleMode = null,
        this._fullScreenRestore = null,
        this._gameSize = new c.Rectangle,
        this._userScaleFactor = new c.Point(1,1),
        this._userScaleTrim = new c.Point(0,0),
        this._lastUpdate = 0,
        this._updateThrottle = 0,
        this._updateThrottleReset = 100,
        this._parentBounds = new c.Rectangle,
        this._tempBounds = new c.Rectangle,
        this._lastReportedCanvasSize = new c.Rectangle,
        this._lastReportedGameSize = new c.Rectangle,
        this._booted = !1,
        a.config && this.parseConfig(a.config),
        this.setupScale(b, d)
    }
    ,
    c.ScaleManager.EXACT_FIT = 0,
    c.ScaleManager.NO_SCALE = 1,
    c.ScaleManager.SHOW_ALL = 2,
    c.ScaleManager.RESIZE = 3,
    c.ScaleManager.USER_SCALE = 4,
    c.ScaleManager.prototype = {
        boot: function() {
            var a = this.compatibility;
            a.supportsFullScreen = this.game.device.fullscreen && !this.game.device.cocoonJS,
            this.game.device.iPad || this.game.device.webApp || this.game.device.desktop || (a.scrollTo = this.game.device.android && !this.game.device.chrome ? new c.Point(0,1) : new c.Point(0,0)),
            this.game.device.desktop ? (a.orientationFallback = "screen",
            a.clickTrampoline = "when-not-mouse") : (a.orientationFallback = "",
            a.clickTrampoline = "");
            var b = this;
            this._orientationChange = function(a) {
                return b.orientationChange(a)
            }
            ,
            this._windowResize = function(a) {
                return b.windowResize(a)
            }
            ,
            window.addEventListener("orientationchange", this._orientationChange, !1),
            window.addEventListener("resize", this._windowResize, !1),
            this.compatibility.supportsFullScreen && (this._fullScreenChange = function(a) {
                return b.fullScreenChange(a)
            }
            ,
            this._fullScreenError = function(a) {
                return b.fullScreenError(a)
            }
            ,
            document.addEventListener("webkitfullscreenchange", this._fullScreenChange, !1),
            document.addEventListener("mozfullscreenchange", this._fullScreenChange, !1),
            document.addEventListener("MSFullscreenChange", this._fullScreenChange, !1),
            document.addEventListener("fullscreenchange", this._fullScreenChange, !1),
            document.addEventListener("webkitfullscreenerror", this._fullScreenError, !1),
            document.addEventListener("mozfullscreenerror", this._fullScreenError, !1),
            document.addEventListener("MSFullscreenError", this._fullScreenError, !1),
            document.addEventListener("fullscreenerror", this._fullScreenError, !1)),
            this.game.onResume.add(this._gameResumed, this),
            this.dom.getOffset(this.game.canvas, this.offset),
            this.bounds.setTo(this.offset.x, this.offset.y, this.width, this.height),
            this.setGameSize(this.game.width, this.game.height),
            this.screenOrientation = this.dom.getScreenOrientation(this.compatibility.orientationFallback),
            this.grid = new c.FlexGrid(this,this.width,this.height),
            this._booted = !0,
            this._pendingScaleMode && (this.scaleMode = this._pendingScaleMode,
            this._pendingScaleMode = null)
        },
        parseConfig: function(a) {
            a.scaleMode && (this._booted ? this.scaleMode = a.scaleMode : this._pendingScaleMode = a.scaleMode),
            a.fullScreenScaleMode && (this.fullScreenScaleMode = a.fullScreenScaleMode),
            a.fullScreenTarget && (this.fullScreenTarget = a.fullScreenTarget)
        },
        setupScale: function(a, b) {
            var d, e = new c.Rectangle;
            "" !== this.game.parent && ("string" == typeof this.game.parent ? d = document.getElementById(this.game.parent) : this.game.parent && 1 === this.game.parent.nodeType && (d = this.game.parent)),
            d ? (this.parentNode = d,
            this.parentIsWindow = !1,
            this.getParentBounds(this._parentBounds),
            e.width = this._parentBounds.width,
            e.height = this._parentBounds.height,
            this.offset.set(this._parentBounds.x, this._parentBounds.y)) : (this.parentNode = null,
            this.parentIsWindow = !0,
            e.width = this.dom.visualBounds.width,
            e.height = this.dom.visualBounds.height,
            this.offset.set(0, 0));
            var f = 0
              , g = 0;
            "number" == typeof a ? f = a : (this.parentScaleFactor.x = parseInt(a, 10) / 100,
            f = e.width * this.parentScaleFactor.x),
            "number" == typeof b ? g = b : (this.parentScaleFactor.y = parseInt(b, 10) / 100,
            g = e.height * this.parentScaleFactor.y),
            this._gameSize.setTo(0, 0, f, g),
            this.updateDimensions(f, g, !1)
        },
        _gameResumed: function() {
            this.queueUpdate(!0)
        },
        setGameSize: function(a, b) {
            this._gameSize.setTo(0, 0, a, b),
            this.currentScaleMode !== c.ScaleManager.RESIZE && this.updateDimensions(a, b, !0),
            this.queueUpdate(!0)
        },
        setUserScale: function(a, b, c, d) {
            this._userScaleFactor.setTo(a, b),
            this._userScaleTrim.setTo(0 | c, 0 | d),
            this.queueUpdate(!0)
        },
        setResizeCallback: function(a, b) {
            this.onResize = a,
            this.onResizeContext = b
        },
        signalSizeChange: function() {
            if (!c.Rectangle.sameDimensions(this, this._lastReportedCanvasSize) || !c.Rectangle.sameDimensions(this.game, this._lastReportedGameSize)) {
                var a = this.width
                  , b = this.height;
                this._lastReportedCanvasSize.setTo(0, 0, a, b),
                this._lastReportedGameSize.setTo(0, 0, this.game.width, this.game.height),
                this.grid.onResize(a, b),
                this.onSizeChange.dispatch(this, a, b),
                this.currentScaleMode === c.ScaleManager.RESIZE && (this.game.state.resize(a, b),
                this.game.load.resize(a, b))
            }
        },
        setMinMax: function(a, b, c, d) {
            this.minWidth = a,
            this.minHeight = b,
            "undefined" != typeof c && (this.maxWidth = c),
            "undefined" != typeof d && (this.maxHeight = d)
        },
        preUpdate: function() {
            if (!(this.game.time.time < this._lastUpdate + this._updateThrottle)) {
                var a = this._updateThrottle;
                this._updateThrottleReset = a >= 400 ? 0 : 100,
                this.dom.getOffset(this.game.canvas, this.offset);
                var b = this._parentBounds.width
                  , d = this._parentBounds.height
                  , e = this.getParentBounds(this._parentBounds)
                  , f = e.width !== b || e.height !== d
                  , g = this.updateOrientationState();
                (f || g) && (this.onResize && this.onResize.call(this.onResizeContext, this, e),
                this.updateLayout(),
                this.signalSizeChange());
                var h = 2 * this._updateThrottle;
                this._updateThrottle < a && (h = Math.min(a, this._updateThrottleReset)),
                this._updateThrottle = c.Math.clamp(h, 25, this.trackParentInterval),
                this._lastUpdate = this.game.time.time
            }
        },
        pauseUpdate: function() {
            this.preUpdate(),
            this._updateThrottle = this.trackParentInterval
        },
        updateDimensions: function(a, b, c) {
            this.width = a * this.parentScaleFactor.x,
            this.height = b * this.parentScaleFactor.y,
            this.game.width = this.width,
            this.game.height = this.height,
            this.sourceAspectRatio = this.width / this.height,
            this.updateScalingAndBounds(),
            c && (this.game.renderer.resize(this.width, this.height),
            this.game.camera.setSize(this.width, this.height),
            this.game.world.resize(this.width, this.height))
        },
        updateScalingAndBounds: function() {
            this.scaleFactor.x = this.game.width / this.width,
            this.scaleFactor.y = this.game.height / this.height,
            this.scaleFactorInversed.x = this.width / this.game.width,
            this.scaleFactorInversed.y = this.height / this.game.height,
            this.aspectRatio = this.width / this.height,
            this.game.canvas && this.dom.getOffset(this.game.canvas, this.offset),
            this.bounds.setTo(this.offset.x, this.offset.y, this.width, this.height),
            this.game.input && this.game.input.scale && this.game.input.scale.setTo(this.scaleFactor.x, this.scaleFactor.y)
        },
        forceOrientation: function(a, b) {
            void 0 === b && (b = !1),
            this.forceLandscape = a,
            this.forcePortrait = b,
            this.queueUpdate(!0)
        },
        classifyOrientation: function(a) {
            return "portrait-primary" === a || "portrait-secondary" === a ? "portrait" : "landscape-primary" === a || "landscape-secondary" === a ? "landscape" : null
        },
        updateOrientationState: function() {
            var a = this.screenOrientation
              , b = this.incorrectOrientation;
            this.screenOrientation = this.dom.getScreenOrientation(this.compatibility.orientationFallback),
            this.incorrectOrientation = this.forceLandscape && !this.isLandscape || this.forcePortrait && !this.isPortrait;
            var c = a !== this.screenOrientation
              , d = b !== this.incorrectOrientation;
            return d && (this.incorrectOrientation ? this.enterIncorrectOrientation.dispatch() : this.leaveIncorrectOrientation.dispatch()),
            (c || d) && this.onOrientationChange.dispatch(this, a, b),
            c || d
        },
        orientationChange: function(a) {
            this.event = a,
            this.queueUpdate(!0)
        },
        windowResize: function(a) {
            this.event = a,
            this.queueUpdate(!0)
        },
        scrollTop: function() {
            var a = this.compatibility.scrollTo;
            a && window.scrollTo(a.x, a.y)
        },
        refresh: function() {
            this.scrollTop(),
            this.queueUpdate(!0)
        },
        updateLayout: function() {
            var a = this.currentScaleMode;
            if (a === c.ScaleManager.RESIZE)
                return void this.reflowGame();
            if (this.scrollTop(),
            this.compatibility.forceMinimumDocumentHeight && (document.documentElement.style.minHeight = window.innerHeight + "px"),
            this.incorrectOrientation ? this.setMaximum() : a === c.ScaleManager.EXACT_FIT ? this.setExactFit() : a === c.ScaleManager.SHOW_ALL ? !this.isFullScreen && this.boundingParent && this.compatibility.canExpandParent ? (this.setShowAll(!0),
            this.resetCanvas(),
            this.setShowAll()) : this.setShowAll() : a === c.ScaleManager.NO_SCALE ? (this.width = this.game.width,
            this.height = this.game.height) : a === c.ScaleManager.USER_SCALE && (this.width = this.game.width * this._userScaleFactor.x - this._userScaleTrim.x,
            this.height = this.game.height * this._userScaleFactor.y - this._userScaleTrim.y),
            !this.compatibility.canExpandParent && (a === c.ScaleManager.SHOW_ALL || a === c.ScaleManager.USER_SCALE)) {
                var b = this.getParentBounds(this._tempBounds);
                this.width = Math.min(this.width, b.width),
                this.height = Math.min(this.height, b.height)
            }
            this.width = 0 | this.width,
            this.height = 0 | this.height,
            this.reflowCanvas()
        },
        getParentBounds: function(a) {
            var b = a || new c.Rectangle
              , d = this.boundingParent
              , e = this.dom.visualBounds
              , f = this.dom.layoutBounds;
            if (d) {
                var g = d.getBoundingClientRect();
                b.setTo(g.left, g.top, g.width, g.height);
                var h = this.windowConstraints;
                if (h.right) {
                    var i = "layout" === h.right ? f : e;
                    b.right = Math.min(b.right, i.width)
                }
                if (h.bottom) {
                    var i = "layout" === h.bottom ? f : e;
                    b.bottom = Math.min(b.bottom, i.height)
                }
            } else
                b.setTo(0, 0, e.width, e.height);
            return b.setTo(Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)),
            b
        },
        alignCanvas: function(a, b) {
            var c = this.getParentBounds(this._tempBounds)
              , d = this.game.canvas
              , e = this.margin;
            if (a) {
                e.left = e.right = 0;
                var f = d.getBoundingClientRect();
                if (this.width < c.width && !this.incorrectOrientation) {
                    var g = f.left - c.x
                      , h = c.width / 2 - this.width / 2;
                    h = Math.max(h, 0);
                    var i = h - g;
                    e.left = Math.round(i)
                }
                d.style.marginLeft = e.left + "px",
                0 !== e.left && (e.right = -(c.width - f.width - e.left),
                d.style.marginRight = e.right + "px")
            }
            if (b) {
                e.top = e.bottom = 0;
                var f = d.getBoundingClientRect();
                if (this.height < c.height && !this.incorrectOrientation) {
                    var g = f.top - c.y
                      , h = c.height / 2 - this.height / 2;
                    h = Math.max(h, 0);
                    var i = h - g;
                    e.top = Math.round(i)
                }
                d.style.marginTop = e.top + "px",
                0 !== e.top && (e.bottom = -(c.height - f.height - e.top),
                d.style.marginBottom = e.bottom + "px")
            }
            e.x = e.left,
            e.y = e.top
        },
        reflowGame: function() {
            this.resetCanvas("", "");
            var a = this.getParentBounds(this._tempBounds);
            this.updateDimensions(a.width, a.height, !0)
        },
        reflowCanvas: function() {
            this.incorrectOrientation || (this.width = c.Math.clamp(this.width, this.minWidth || 0, this.maxWidth || this.width),
            this.height = c.Math.clamp(this.height, this.minHeight || 0, this.maxHeight || this.height)),
            this.resetCanvas(),
            this.compatibility.noMargins || (this.isFullScreen && this._createdFullScreenTarget ? this.alignCanvas(!0, !0) : this.alignCanvas(this.pageAlignHorizontally, this.pageAlignVertically)),
            this.updateScalingAndBounds()
        },
        resetCanvas: function(a, b) {
            void 0 === a && (a = this.width + "px"),
            void 0 === b && (b = this.height + "px");
            var c = this.game.canvas;
            this.compatibility.noMargins || (c.style.marginLeft = "",
            c.style.marginTop = "",
            c.style.marginRight = "",
            c.style.marginBottom = ""),
            c.style.width = a,
            c.style.height = b
        },
        queueUpdate: function(a) {
            a && (this._parentBounds.width = 0,
            this._parentBounds.height = 0),
            this._updateThrottle = this._updateThrottleReset
        },
        reset: function(a) {
            a && this.grid.reset()
        },
        setMaximum: function() {
            this.width = this.dom.visualBounds.width,
            this.height = this.dom.visualBounds.height
        },
        setShowAll: function(a) {
            var b, c = this.getParentBounds(this._tempBounds), d = c.width, e = c.height;
            b = a ? Math.max(e / this.game.height, d / this.game.width) : Math.min(e / this.game.height, d / this.game.width),
            this.width = Math.round(this.game.width * b),
            this.height = Math.round(this.game.height * b)
        },
        setExactFit: function() {
            var a = this.getParentBounds(this._tempBounds);
            this.width = a.width,
            this.height = a.height,
            this.isFullScreen || (this.maxWidth && (this.width = Math.min(this.width, this.maxWidth)),
            this.maxHeight && (this.height = Math.min(this.height, this.maxHeight)))
        },
        createFullScreenTarget: function() {
            var a = document.createElement("div");
            return a.style.margin = "0",
            a.style.padding = "0",
            a.style.background = "#000",
            a
        },
        startFullScreen: function(a, b) {
            if (this.isFullScreen)
                return !1;
            if (!this.compatibility.supportsFullScreen) {
                var d = this;
                return void setTimeout(function() {
                    d.fullScreenError()
                }, 10)
            }
            if ("when-not-mouse" === this.compatibility.clickTrampoline) {
                var e = this.game.input;
                if (e.activePointer && e.activePointer !== e.mousePointer && (b || b !== !1))
                    return void e.activePointer.addClickTrampoline("startFullScreen", this.startFullScreen, this, [a, !1])
            }
            "undefined" != typeof a && this.game.renderType === c.CANVAS && (this.game.stage.smoothed = a);
            var f = this.fullScreenTarget;
            f || (this.cleanupCreatedTarget(),
            this._createdFullScreenTarget = this.createFullScreenTarget(),
            f = this._createdFullScreenTarget);
            var g = {
                targetElement: f
            };
            if (this.onFullScreenInit.dispatch(this, g),
            this._createdFullScreenTarget) {
                var h = this.game.canvas
                  , i = h.parentNode;
                i.insertBefore(f, h),
                f.appendChild(h)
            }
            return this.game.device.fullscreenKeyboard ? f[this.game.device.requestFullscreen](Element.ALLOW_KEYBOARD_INPUT) : f[this.game.device.requestFullscreen](),
            !0
        },
        stopFullScreen: function() {
            return this.isFullScreen && this.compatibility.supportsFullScreen ? (document[this.game.device.cancelFullscreen](),
            !0) : !1
        },
        cleanupCreatedTarget: function() {
            var a = this._createdFullScreenTarget;
            if (a && a.parentNode) {
                var b = a.parentNode;
                b.insertBefore(this.game.canvas, a),
                b.removeChild(a)
            }
            this._createdFullScreenTarget = null
        },
        prepScreenMode: function(a) {
            var b = !!this._createdFullScreenTarget
              , d = this._createdFullScreenTarget || this.fullScreenTarget;
            a ? (b || this.fullScreenScaleMode === c.ScaleManager.EXACT_FIT) && d !== this.game.canvas && (this._fullScreenRestore = {
                targetWidth: d.style.width,
                targetHeight: d.style.height
            },
            d.style.width = "100%",
            d.style.height = "100%") : (this._fullScreenRestore && (d.style.width = this._fullScreenRestore.targetWidth,
            d.style.height = this._fullScreenRestore.targetHeight,
            this._fullScreenRestore = null),
            this.updateDimensions(this._gameSize.width, this._gameSize.height, !0),
            this.resetCanvas())
        },
        fullScreenChange: function(a) {
            this.event = a,
            this.isFullScreen ? (this.prepScreenMode(!0),
            this.updateLayout(),
            this.queueUpdate(!0)) : (this.prepScreenMode(!1),
            this.cleanupCreatedTarget(),
            this.updateLayout(),
            this.queueUpdate(!0)),
            this.onFullScreenChange.dispatch(this, this.width, this.height)
        },
        fullScreenError: function(a) {
            this.event = a,
            this.cleanupCreatedTarget(),
            console.warn("Phaser.ScaleManager: requestFullscreen failed or device does not support the Fullscreen API"),
            this.onFullScreenError.dispatch(this)
        },
        scaleSprite: function(a, b, c, d) {
            if (void 0 === b && (b = this.width),
            void 0 === c && (c = this.height),
            void 0 === d && (d = !1),
            !a || !a.scale)
                return a;
            if (a.scale.x = 1,
            a.scale.y = 1,
            a.width <= 0 || a.height <= 0 || 0 >= b || 0 >= c)
                return a;
            var e = b
              , f = a.height * b / a.width
              , g = a.width * c / a.height
              , h = c
              , i = g > b;
            return i = i ? d : !d,
            i ? (a.width = Math.floor(e),
            a.height = Math.floor(f)) : (a.width = Math.floor(g),
            a.height = Math.floor(h)),
            a
        },
        destroy: function() {
            this.game.onResume.remove(this._gameResumed, this),
            window.removeEventListener("orientationchange", this._orientationChange, !1),
            window.removeEventListener("resize", this._windowResize, !1),
            this.compatibility.supportsFullScreen && (document.removeEventListener("webkitfullscreenchange", this._fullScreenChange, !1),
            document.removeEventListener("mozfullscreenchange", this._fullScreenChange, !1),
            document.removeEventListener("MSFullscreenChange", this._fullScreenChange, !1),
            document.removeEventListener("fullscreenchange", this._fullScreenChange, !1),
            document.removeEventListener("webkitfullscreenerror", this._fullScreenError, !1),
            document.removeEventListener("mozfullscreenerror", this._fullScreenError, !1),
            document.removeEventListener("MSFullscreenError", this._fullScreenError, !1),
            document.removeEventListener("fullscreenerror", this._fullScreenError, !1))
        }
    },
    c.ScaleManager.prototype.constructor = c.ScaleManager,
    Object.defineProperty(c.ScaleManager.prototype, "boundingParent", {
        get: function() {
            if (this.parentIsWindow || this.isFullScreen && !this._createdFullScreenTarget)
                return null;
            var a = this.game.canvas && this.game.canvas.parentNode;
            return a || null
        }
    }),
    Object.defineProperty(c.ScaleManager.prototype, "scaleMode", {
        get: function() {
            return this._scaleMode
        },
        set: function(a) {
            return a !== this._scaleMode && (this.isFullScreen || (this.updateDimensions(this._gameSize.width, this._gameSize.height, !0),
            this.queueUpdate(!0)),
            this._scaleMode = a),
            this._scaleMode
        }
    }),
    Object.defineProperty(c.ScaleManager.prototype, "fullScreenScaleMode", {
        get: function() {
            return this._fullScreenScaleMode
        },
        set: function(a) {
            return a !== this._fullScreenScaleMode && (this.isFullScreen ? (this.prepScreenMode(!1),
            this._fullScreenScaleMode = a,
            this.prepScreenMode(!0),
            this.queueUpdate(!0)) : this._fullScreenScaleMode = a),
            this._fullScreenScaleMode
        }
    }),
    Object.defineProperty(c.ScaleManager.prototype, "currentScaleMode", {
        get: function() {
            return this.isFullScreen ? this._fullScreenScaleMode : this._scaleMode
        }
    }),
    Object.defineProperty(c.ScaleManager.prototype, "pageAlignHorizontally", {
        get: function() {
            return this._pageAlignHorizontally
        },
        set: function(a) {
            a !== this._pageAlignHorizontally && (this._pageAlignHorizontally = a,
            this.queueUpdate(!0))
        }
    }),
    Object.defineProperty(c.ScaleManager.prototype, "pageAlignVertically", {
        get: function() {
            return this._pageAlignVertically
        },
        set: function(a) {
            a !== this._pageAlignVertically && (this._pageAlignVertically = a,
            this.queueUpdate(!0))
        }
    }),
    Object.defineProperty(c.ScaleManager.prototype, "isFullScreen", {
        get: function() {
            return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)
        }
    }),
    Object.defineProperty(c.ScaleManager.prototype, "isPortrait", {
        get: function() {
            return "portrait" === this.classifyOrientation(this.screenOrientation)
        }
    }),
    Object.defineProperty(c.ScaleManager.prototype, "isLandscape", {
        get: function() {
            return "landscape" === this.classifyOrientation(this.screenOrientation)
        }
    }),
    Object.defineProperty(c.ScaleManager.prototype, "isGamePortrait", {
        get: function() {
            return this.height > this.width
        }
    }),
    Object.defineProperty(c.ScaleManager.prototype, "isGameLandscape", {
        get: function() {
            return this.width > this.height
        }
    }),
    c.Game = function(a, b, d, e, f, g, h, i) {
        return this.id = c.GAMES.push(this) - 1,
        this.config = null,
        this.physicsConfig = i,
        this.parent = "",
        this.width = 800,
        this.height = 600,
        this.resolution = 1,
        this._width = 800,
        this._height = 600,
        this.transparent = !1,
        this.antialias = !0,
        this.preserveDrawingBuffer = !1,
        this.renderer = null,
        this.renderType = c.AUTO,
        this.state = null,
        this.isBooted = !1,
        this.isRunning = !1,
        this.raf = null,
        this.add = null,
        this.make = null,
        this.cache = null,
        this.input = null,
        this.load = null,
        this.math = null,
        this.net = null,
        this.scale = null,
        this.sound = null,
        this.stage = null,
        this.time = null,
        this.tweens = null,
        this.world = null,
        this.physics = null,
        this.plugins = null,
        this.rnd = null,
        this.device = c.Device,
        this.camera = null,
        this.canvas = null,
        this.context = null,
        this.debug = null,
        this.particles = null,
        this.create = null,
        this.lockRender = !1,
        this.stepping = !1,
        this.pendingStep = !1,
        this.stepCount = 0,
        this.onPause = null,
        this.onResume = null,
        this.onBlur = null,
        this.onFocus = null,
        this._paused = !1,
        this._codePaused = !1,
        this.currentUpdateID = 0,
        this.updatesThisFrame = 1,
        this._deltaTime = 0,
        this._lastCount = 0,
        this._spiraling = 0,
        this._kickstart = !0,
        this.fpsProblemNotifier = new c.Signal,
        this.forceSingleUpdate = !1,
        this._nextFpsNotification = 0,
        1 === arguments.length && "object" == typeof arguments[0] ? this.parseConfig(arguments[0]) : (this.config = {
            enableDebug: !0
        },
        "undefined" != typeof a && (this._width = a),
        "undefined" != typeof b && (this._height = b),
        "undefined" != typeof d && (this.renderType = d),
        "undefined" != typeof e && (this.parent = e),
        "undefined" != typeof g && (this.transparent = g),
        "undefined" != typeof h && (this.antialias = h),
        this.rnd = new c.RandomDataGenerator([(Date.now() * Math.random()).toString()]),
        this.state = new c.StateManager(this,f)),
        this.device.whenReady(this.boot, this),
        this
    }
    ,
    c.Game.prototype = {
        parseConfig: function(a) {
            this.config = a,
            void 0 === a.enableDebug && (this.config.enableDebug = !0),
            a.width && (this._width = a.width),
            a.height && (this._height = a.height),
            a.renderer && (this.renderType = a.renderer),
            a.parent && (this.parent = a.parent),
            a.transparent && (this.transparent = a.transparent),
            a.antialias && (this.antialias = a.antialias),
            a.resolution && (this.resolution = a.resolution),
            a.preserveDrawingBuffer && (this.preserveDrawingBuffer = a.preserveDrawingBuffer),
            a.physicsConfig && (this.physicsConfig = a.physicsConfig);
            var b = [(Date.now() * Math.random()).toString()];
            a.seed && (b = a.seed),
            this.rnd = new c.RandomDataGenerator(b);
            var d = null;
            a.state && (d = a.state),
            this.state = new c.StateManager(this,d)
        },
        boot: function() {
            this.isBooted || (this.onPause = new c.Signal,
            this.onResume = new c.Signal,
            this.onBlur = new c.Signal,
            this.onFocus = new c.Signal,
            this.isBooted = !0,
            this.math = c.Math,
            this.scale = new c.ScaleManager(this,this._width,this._height),
            this.stage = new c.Stage(this),
            this.setUpRenderer(),
            this.world = new c.World(this),
            this.add = new c.GameObjectFactory(this),
            this.make = new c.GameObjectCreator(this),
            this.cache = new c.Cache(this),
            this.load = new c.Loader(this),
            this.time = new c.Time(this),
            this.tweens = new c.TweenManager(this),
            this.input = new c.Input(this),
            this.sound = new c.SoundManager(this),
            this.physics = new c.Physics(this,this.physicsConfig),
            this.particles = new c.Particles(this),
            this.create = new c.Create(this),
            this.plugins = new c.PluginManager(this),
            this.net = new c.Net(this),
            this.time.boot(),
            this.stage.boot(),
            this.world.boot(),
            this.scale.boot(),
            this.input.boot(),
            this.sound.boot(),
            this.state.boot(),
            this.config.enableDebug ? (this.debug = new c.Utils.Debug(this),
            this.debug.boot()) : this.debug = {
                preUpdate: function() {},
                update: function() {},
                reset: function() {}
            },
            this.showDebugHeader(),
            this.isRunning = !0,
            this.raf = this.config && this.config.forceSetTimeOut ? new c.RequestAnimationFrame(this,this.config.forceSetTimeOut) : new c.RequestAnimationFrame(this,!1),
            this._kickstart = !0,
            window.focus && (!window.PhaserGlobal || window.PhaserGlobal && !window.PhaserGlobal.stopFocus) && window.focus(),
            this.raf.start())
        },
        showDebugHeader: function() {
            if (!window.PhaserGlobal || !window.PhaserGlobal.hideBanner) {
                var a = c.VERSION
                  , b = "Canvas"
                  , d = "HTML Audio"
                  , e = 1;
                if (this.renderType === c.WEBGL ? (b = "WebGL",
                e++) : this.renderType == c.HEADLESS && (b = "Headless"),
                this.device.webAudio && (d = "WebAudio",
                e++),
                this.device.chrome) {
                    for (var f = ["%c %c %c Phaser v" + a + " | Pixi.js " + PIXI.VERSION + " | " + b + " | " + d + "  %c %c %c http://phaser.io %c♥%c♥%c♥", "background: #9854d8", "background: #6c2ca7", "color: #ffffff; background: #450f78;", "background: #6c2ca7", "background: #9854d8", "background: #ffffff"], g = 0; 3 > g; g++)
                        f.push(e > g ? "color: #ff2424; background: #fff" : "color: #959595; background: #fff");
                    console.log.apply(console, f)
                } else
                    window.console && console.log("Phaser v" + a + " | Pixi.js " + PIXI.VERSION + " | " + b + " | " + d + " | http://phaser.io")
            }
        },
        setUpRenderer: function() {
            if (this.canvas = c.Canvas.create(this, this.width, this.height, this.config.canvasID, !0),
            this.config.canvasStyle ? this.canvas.style = this.config.canvasStyle : this.canvas.style["-webkit-full-screen"] = "width: 100%; height: 100%",
            this.device.cocoonJS && (this.canvas.screencanvas = this.renderType === c.CANVAS ? !0 : !1),
            this.renderType === c.HEADLESS || this.renderType === c.CANVAS || this.renderType === c.AUTO && this.device.webGL === !1) {
                if (!this.device.canvas)
                    throw new Error("Phaser.Game - cannot create Canvas or WebGL context, aborting.");
                this.renderType === c.AUTO && (this.renderType = c.CANVAS),
                this.renderer = new PIXI.CanvasRenderer(this.width,this.height,{
                    view: this.canvas,
                    transparent: this.transparent,
                    resolution: this.resolution,
                    clearBeforeRender: !0
                }),
                this.context = this.renderer.context
            } else
                this.renderType = c.WEBGL,
                this.renderer = new PIXI.WebGLRenderer(this.width,this.height,{
                    view: this.canvas,
                    transparent: this.transparent,
                    resolution: this.resolution,
                    antialias: this.antialias,
                    preserveDrawingBuffer: this.preserveDrawingBuffer
                }),
                this.context = null,
                this.canvas.addEventListener("webglcontextlost", this.contextLost.bind(this), !1),
                this.canvas.addEventListener("webglcontextrestored", this.contextRestored.bind(this), !1);
            this.renderType !== c.HEADLESS && (this.stage.smoothed = this.antialias,
            c.Canvas.addToDOM(this.canvas, this.parent, !1),
            c.Canvas.setTouchAction(this.canvas))
        },
        contextLost: function(a) {
            a.preventDefault(),
            this.renderer.contextLost = !0
        },
        contextRestored: function() {
            this.renderer.initContext(),
            this.cache.clearGLTextures(),
            this.renderer.contextLost = !1
        },
        update: function(a) {
            if (this.time.update(a),
            this._kickstart)
                return this.updateLogic(1 / this.time.desiredFps),
                this.stage.updateTransform(),
                this.updateRender(this.time.slowMotion * this.time.desiredFps),
                void (this._kickstart = !1);
            if (this._spiraling > 1 && !this.forceSingleUpdate)
                this.time.time > this._nextFpsNotification && (this._nextFpsNotification = this.time.time + 1e4,
                this.fpsProblemNotifier.dispatch()),
                this._deltaTime = 0,
                this._spiraling = 0,
                this.updateRender(this.time.slowMotion * this.time.desiredFps);
            else {
                var b = 1e3 * this.time.slowMotion / this.time.desiredFps;
                this._deltaTime += Math.max(Math.min(3 * b, this.time.elapsed), 0);
                var c = 0;
                for (this.updatesThisFrame = Math.floor(this._deltaTime / b),
                this.forceSingleUpdate && (this.updatesThisFrame = Math.min(1, this.updatesThisFrame)); this._deltaTime >= b && (this._deltaTime -= b,
                this.currentUpdateID = c,
                this.updateLogic(1 / this.time.desiredFps),
                this.stage.updateTransform(),
                c++,
                !this.forceSingleUpdate || 1 !== c); )
                    ;
                c > this._lastCount ? this._spiraling++ : c < this._lastCount && (this._spiraling = 0),
                this._lastCount = c,
                this.updateRender(this._deltaTime / b)
            }
        },
        updateLogic: function(a) {
            this._paused || this.pendingStep ? (this.scale.pauseUpdate(),
            this.state.pauseUpdate(),
            this.debug.preUpdate()) : (this.stepping && (this.pendingStep = !0),
            this.scale.preUpdate(),
            this.debug.preUpdate(),
            this.world.camera.preUpdate(),
            this.physics.preUpdate(),
            this.state.preUpdate(a),
            this.plugins.preUpdate(a),
            this.stage.preUpdate(),
            this.state.update(),
            this.stage.update(),
            this.tweens.update(a),
            this.sound.update(),
            this.input.update(),
            this.physics.update(),
            this.particles.update(),
            this.plugins.update(),
            this.stage.postUpdate(),
            this.plugins.postUpdate())
        },
        updateRender: function(a) {
            this.lockRender || (this.state.preRender(a),
            this.renderer.render(this.stage),
            this.plugins.render(a),
            this.state.render(a),
            this.plugins.postRender(a))
        },
        enableStep: function() {
            this.stepping = !0,
            this.pendingStep = !1,
            this.stepCount = 0
        },
        disableStep: function() {
            this.stepping = !1,
            this.pendingStep = !1
        },
        step: function() {
            this.pendingStep = !1,
            this.stepCount++
        },
        destroy: function() {
            this.raf.stop(),
            this.state.destroy(),
            this.sound.destroy(),
            this.scale.destroy(),
            this.stage.destroy(),
            this.input.destroy(),
            this.physics.destroy(),
            this.state = null,
            this.cache = null,
            this.input = null,
            this.load = null,
            this.sound = null,
            this.stage = null,
            this.time = null,
            this.world = null,
            this.isBooted = !1,
            this.renderer.destroy(!1),
            c.Canvas.removeFromDOM(this.canvas),
            c.GAMES[this.id] = null
        },
        gamePaused: function(a) {
            this._paused || (this._paused = !0,
            this.time.gamePaused(),
            this.sound.setMute(),
            this.onPause.dispatch(a),
            this.device.cordova && this.device.iOS && (this.lockRender = !0))
        },
        gameResumed: function(a) {
            this._paused && !this._codePaused && (this._paused = !1,
            this.time.gameResumed(),
            this.input.reset(),
            this.sound.unsetMute(),
            this.onResume.dispatch(a),
            this.device.cordova && this.device.iOS && (this.lockRender = !1))
        },
        focusLoss: function(a) {
            this.onBlur.dispatch(a),
            this.stage.disableVisibilityChange || this.gamePaused(a)
        },
        focusGain: function(a) {
            this.onFocus.dispatch(a),
            this.stage.disableVisibilityChange || this.gameResumed(a)
        }
    },
    c.Game.prototype.constructor = c.Game,
    Object.defineProperty(c.Game.prototype, "paused", {
        get: function() {
            return this._paused
        },
        set: function(a) {
            a === !0 ? (this._paused === !1 && (this._paused = !0,
            this.sound.setMute(),
            this.time.gamePaused(),
            this.onPause.dispatch(this)),
            this._codePaused = !0) : (this._paused && (this._paused = !1,
            this.input.reset(),
            this.sound.unsetMute(),
            this.time.gameResumed(),
            this.onResume.dispatch(this)),
            this._codePaused = !1)
        }
    }),
    c.Input = function(a) {
        this.game = a,
        this.hitCanvas = null,
        this.hitContext = null,
        this.moveCallbacks = [],
        this.pollRate = 0,
        this.enabled = !0,
        this.multiInputOverride = c.Input.MOUSE_TOUCH_COMBINE,
        this.position = null,
        this.speed = null,
        this.circle = null,
        this.scale = null,
        this.maxPointers = -1,
        this.tapRate = 200,
        this.doubleTapRate = 300,
        this.holdRate = 2e3,
        this.justPressedRate = 200,
        this.justReleasedRate = 200,
        this.recordPointerHistory = !1,
        this.recordRate = 100,
        this.recordLimit = 100,
        this.pointer1 = null,
        this.pointer2 = null,
        this.pointer3 = null,
        this.pointer4 = null,
        this.pointer5 = null,
        this.pointer6 = null,
        this.pointer7 = null,
        this.pointer8 = null,
        this.pointer9 = null,
        this.pointer10 = null,
        this.pointers = [],
        this.activePointer = null,
        this.mousePointer = null,
        this.mouse = null,
        this.keyboard = null,
        this.touch = null,
        this.mspointer = null,
        this.gamepad = null,
        this.resetLocked = !1,
        this.onDown = null,
        this.onUp = null,
        this.onTap = null,
        this.onHold = null,
        this.minPriorityID = 0,
        this.interactiveItems = new c.ArraySet,
        this._localPoint = new c.Point,
        this._pollCounter = 0,
        this._oldPosition = null,
        this._x = 0,
        this._y = 0
    }
    ,
    c.Input.MOUSE_OVERRIDES_TOUCH = 0,
    c.Input.TOUCH_OVERRIDES_MOUSE = 1,
    c.Input.MOUSE_TOUCH_COMBINE = 2,
    c.Input.MAX_POINTERS = 10,
    c.Input.prototype = {
        boot: function() {
            this.mousePointer = new c.Pointer(this.game,0),
            this.addPointer(),
            this.addPointer(),
            this.mouse = new c.Mouse(this.game),
            this.touch = new c.Touch(this.game),
            this.mspointer = new c.MSPointer(this.game),
            c.Keyboard && (this.keyboard = new c.Keyboard(this.game)),
            c.Gamepad && (this.gamepad = new c.Gamepad(this.game)),
            this.onDown = new c.Signal,
            this.onUp = new c.Signal,
            this.onTap = new c.Signal,
            this.onHold = new c.Signal,
            this.scale = new c.Point(1,1),
            this.speed = new c.Point,
            this.position = new c.Point,
            this._oldPosition = new c.Point,
            this.circle = new c.Circle(0,0,44),
            this.activePointer = this.mousePointer,
            this.hitCanvas = PIXI.CanvasPool.create(this, 1, 1),
            this.hitContext = this.hitCanvas.getContext("2d"),
            this.mouse.start(),
            this.touch.start(),
            this.mspointer.start(),
            this.mousePointer.active = !0,
            this.keyboard && this.keyboard.start();
            var a = this;
            this._onClickTrampoline = function(b) {
                a.onClickTrampoline(b)
            }
            ,
            this.game.canvas.addEventListener("click", this._onClickTrampoline, !1)
        },
        destroy: function() {
            this.mouse.stop(),
            this.touch.stop(),
            this.mspointer.stop(),
            this.keyboard && this.keyboard.stop(),
            this.gamepad && this.gamepad.stop(),
            this.moveCallbacks = [],
            PIXI.CanvasPool.remove(this),
            this.game.canvas.removeEventListener("click", this._onClickTrampoline)
        },
        addMoveCallback: function(a, b) {
            this.moveCallbacks.push({
                callback: a,
                context: b
            })
        },
        deleteMoveCallback: function(a, b) {
            for (var c = this.moveCallbacks.length; c--; )
                if (this.moveCallbacks[c].callback === a && this.moveCallbacks[c].context === b)
                    return void this.moveCallbacks.splice(c, 1)
        },
        addPointer: function() {
            if (this.pointers.length >= c.Input.MAX_POINTERS)
                return console.warn("Phaser.Input.addPointer: Maximum limit of " + c.Input.MAX_POINTERS + " pointers reached."),
                null;
            var a = this.pointers.length + 1
              , b = new c.Pointer(this.game,a);
            return this.pointers.push(b),
            this["pointer" + a] = b,
            b
        },
        update: function() {
            if (this.keyboard && this.keyboard.update(),
            this.pollRate > 0 && this._pollCounter < this.pollRate)
                return void this._pollCounter++;
            this.speed.x = this.position.x - this._oldPosition.x,
            this.speed.y = this.position.y - this._oldPosition.y,
            this._oldPosition.copyFrom(this.position),
            this.mousePointer.update(),
            this.gamepad && this.gamepad.active && this.gamepad.update();
            for (var a = 0; a < this.pointers.length; a++)
                this.pointers[a].update();
            this._pollCounter = 0
        },
        reset: function(a) {
            if (this.game.isBooted && !this.resetLocked) {
                void 0 === a && (a = !1),
                this.mousePointer.reset(),
                this.keyboard && this.keyboard.reset(a),
                this.gamepad && this.gamepad.reset();
                for (var b = 0; b < this.pointers.length; b++)
                    this.pointers[b].reset();
                "none" !== this.game.canvas.style.cursor && (this.game.canvas.style.cursor = "inherit"),
                a && (this.onDown.dispose(),
                this.onUp.dispose(),
                this.onTap.dispose(),
                this.onHold.dispose(),
                this.onDown = new c.Signal,
                this.onUp = new c.Signal,
                this.onTap = new c.Signal,
                this.onHold = new c.Signal,
                this.moveCallbacks = []),
                this._pollCounter = 0
            }
        },
        resetSpeed: function(a, b) {
            this._oldPosition.setTo(a, b),
            this.speed.setTo(0, 0)
        },
        startPointer: function(a) {
            if (this.maxPointers >= 0 && this.countActivePointers(this.maxPointers) >= this.maxPointers)
                return null;
            if (!this.pointer1.active)
                return this.pointer1.start(a);
            if (!this.pointer2.active)
                return this.pointer2.start(a);
            for (var b = 2; b < this.pointers.length; b++) {
                var c = this.pointers[b];
                if (!c.active)
                    return c.start(a)
            }
            return null
        },
        updatePointer: function(a) {
            if (this.pointer1.active && this.pointer1.identifier === a.identifier)
                return this.pointer1.move(a);
            if (this.pointer2.active && this.pointer2.identifier === a.identifier)
                return this.pointer2.move(a);
            for (var b = 2; b < this.pointers.length; b++) {
                var c = this.pointers[b];
                if (c.active && c.identifier === a.identifier)
                    return c.move(a)
            }
            return null
        },
        stopPointer: function(a) {
            if (this.pointer1.active && this.pointer1.identifier === a.identifier)
                return this.pointer1.stop(a);
            if (this.pointer2.active && this.pointer2.identifier === a.identifier)
                return this.pointer2.stop(a);
            for (var b = 2; b < this.pointers.length; b++) {
                var c = this.pointers[b];
                if (c.active && c.identifier === a.identifier)
                    return c.stop(a)
            }
            return null
        },
        countActivePointers: function(a) {
            void 0 === a && (a = this.pointers.length);
            for (var b = a, c = 0; c < this.pointers.length && b > 0; c++) {
                var d = this.pointers[c];
                d.active && b--
            }
            return a - b
        },
        getPointer: function(a) {
            void 0 === a && (a = !1);
            for (var b = 0; b < this.pointers.length; b++) {
                var c = this.pointers[b];
                if (c.active === a)
                    return c
            }
            return null
        },
        getPointerFromIdentifier: function(a) {
            for (var b = 0; b < this.pointers.length; b++) {
                var c = this.pointers[b];
                if (c.identifier === a)
                    return c
            }
            return null
        },
        getPointerFromId: function(a) {
            for (var b = 0; b < this.pointers.length; b++) {
                var c = this.pointers[b];
                if (c.pointerId === a)
                    return c
            }
            return null
        },
        getLocalPosition: function(a, b, d) {
            void 0 === d && (d = new c.Point);
            var e = a.worldTransform
              , f = 1 / (e.a * e.d + e.c * -e.b);
            return d.setTo(e.d * f * b.x + -e.c * f * b.y + (e.ty * e.c - e.tx * e.d) * f, e.a * f * b.y + -e.b * f * b.x + (-e.ty * e.a + e.tx * e.b) * f)
        },
        hitTest: function(a, b, d) {
            if (!a.worldVisible)
                return !1;
            if (this.getLocalPosition(a, b, this._localPoint),
            d.copyFrom(this._localPoint),
            a.hitArea && a.hitArea.contains)
                return a.hitArea.contains(this._localPoint.x, this._localPoint.y);
            if (a instanceof c.TileSprite) {
                var e = a.width
                  , f = a.height
                  , g = -e * a.anchor.x;
                if (this._localPoint.x >= g && this._localPoint.x < g + e) {
                    var h = -f * a.anchor.y;
                    if (this._localPoint.y >= h && this._localPoint.y < h + f)
                        return !0
                }
            } else if (a instanceof PIXI.Sprite) {
                var e = a.texture.frame.width
                  , f = a.texture.frame.height
                  , g = -e * a.anchor.x;
                if (this._localPoint.x >= g && this._localPoint.x < g + e) {
                    var h = -f * a.anchor.y;
                    if (this._localPoint.y >= h && this._localPoint.y < h + f)
                        return !0
                }
            } else if (a instanceof c.Graphics)
                for (var i = 0; i < a.graphicsData.length; i++) {
                    var j = a.graphicsData[i];
                    if (j.fill && j.shape && j.shape.contains(this._localPoint.x, this._localPoint.y))
                        return !0
                }
            for (var i = 0, k = a.children.length; k > i; i++)
                if (this.hitTest(a.children[i], b, d))
                    return !0;
            return !1
        },
        onClickTrampoline: function() {
            this.activePointer.processClickTrampolines()
        }
    },
    c.Input.prototype.constructor = c.Input,
    Object.defineProperty(c.Input.prototype, "x", {
        get: function() {
            return this._x
        },
        set: function(a) {
            this._x = Math.floor(a)
        }
    }),
    Object.defineProperty(c.Input.prototype, "y", {
        get: function() {
            return this._y
        },
        set: function(a) {
            this._y = Math.floor(a)
        }
    }),
    Object.defineProperty(c.Input.prototype, "pollLocked", {
        get: function() {
            return this.pollRate > 0 && this._pollCounter < this.pollRate
        }
    }),
    Object.defineProperty(c.Input.prototype, "totalInactivePointers", {
        get: function() {
            return this.pointers.length - this.countActivePointers()
        }
    }),
    Object.defineProperty(c.Input.prototype, "totalActivePointers", {
        get: function() {
            return this.countActivePointers()
        }
    }),
    Object.defineProperty(c.Input.prototype, "worldX", {
        get: function() {
            return this.game.camera.view.x + this.x
        }
    }),
    Object.defineProperty(c.Input.prototype, "worldY", {
        get: function() {
            return this.game.camera.view.y + this.y
        }
    }),
    c.Mouse = function(a) {
        this.game = a,
        this.input = a.input,
        this.callbackContext = this.game,
        this.mouseDownCallback = null,
        this.mouseUpCallback = null,
        this.mouseOutCallback = null,
        this.mouseOverCallback = null,
        this.mouseWheelCallback = null,
        this.capture = !1,
        this.button = -1,
        this.wheelDelta = 0,
        this.enabled = !0,
        this.locked = !1,
        this.stopOnGameOut = !1,
        this.pointerLock = new c.Signal,
        this.event = null,
        this._onMouseDown = null,
        this._onMouseMove = null,
        this._onMouseUp = null,
        this._onMouseOut = null,
        this._onMouseOver = null,
        this._onMouseWheel = null,
        this._wheelEvent = null
    }
    ,
    c.Mouse.NO_BUTTON = -1,
    c.Mouse.LEFT_BUTTON = 0,
    c.Mouse.MIDDLE_BUTTON = 1,
    c.Mouse.RIGHT_BUTTON = 2,
    c.Mouse.BACK_BUTTON = 3,
    c.Mouse.FORWARD_BUTTON = 4,
    c.Mouse.WHEEL_UP = 1,
    c.Mouse.WHEEL_DOWN = -1,
    c.Mouse.prototype = {
        start: function() {
            if ((!this.game.device.android || this.game.device.chrome !== !1) && null === this._onMouseDown) {
                var b = this;
                this._onMouseDown = function(a) {
                    return b.onMouseDown(a)
                }
                ,
                this._onMouseMove = function(a) {
                    return b.onMouseMove(a)
                }
                ,
                this._onMouseUp = function(a) {
                    return b.onMouseUp(a)
                }
                ,
                this._onMouseUpGlobal = function(a) {
                    return b.onMouseUpGlobal(a)
                }
                ,
                this._onMouseOut = function(a) {
                    return b.onMouseOut(a)
                }
                ,
                this._onMouseOver = function(a) {
                    return b.onMouseOver(a)
                }
                ,
                this._onMouseWheel = function(a) {
                    return b.onMouseWheel(a)
                }
                ;
                var c = this.game.canvas;
                c.addEventListener("mousedown", this._onMouseDown, !0),
                c.addEventListener("mousemove", this._onMouseMove, !0),
                c.addEventListener("mouseup", this._onMouseUp, !0),
                this.game.device.cocoonJS || (window.addEventListener("mouseup", this._onMouseUpGlobal, !0),
                c.addEventListener("mouseover", this._onMouseOver, !0),
                c.addEventListener("mouseout", this._onMouseOut, !0));
                var d = this.game.device.wheelEvent;
                d && (c.addEventListener(d, this._onMouseWheel, !0),
                "mousewheel" === d ? this._wheelEvent = new a(-1 / 40,1) : "DOMMouseScroll" === d && (this._wheelEvent = new a(1,1)))
            }
        },
        onMouseDown: function(a) {
            this.event = a,
            this.capture && a.preventDefault(),
            this.mouseDownCallback && this.mouseDownCallback.call(this.callbackContext, a),
            this.input.enabled && this.enabled && (a.identifier = 0,
            this.input.mousePointer.start(a))
        },
        onMouseMove: function(a) {
            this.event = a,
            this.capture && a.preventDefault(),
            this.mouseMoveCallback && this.mouseMoveCallback.call(this.callbackContext, a),
            this.input.enabled && this.enabled && (a.identifier = 0,
            this.input.mousePointer.move(a))
        },
        onMouseUp: function(a) {
            this.event = a,
            this.capture && a.preventDefault(),
            this.mouseUpCallback && this.mouseUpCallback.call(this.callbackContext, a),
            this.input.enabled && this.enabled && (a.identifier = 0,
            this.input.mousePointer.stop(a))
        },
        onMouseUpGlobal: function(a) {
            this.input.mousePointer.withinGame || (this.mouseUpCallback && this.mouseUpCallback.call(this.callbackContext, a),
            a.identifier = 0,
            this.input.mousePointer.stop(a))
        },
        onMouseOut: function(a) {
            this.event = a,
            this.capture && a.preventDefault(),
            this.input.mousePointer.withinGame = !1,
            this.mouseOutCallback && this.mouseOutCallback.call(this.callbackContext, a),
            this.input.enabled && this.enabled && this.stopOnGameOut && (a.identifier = 0,
            this.input.mousePointer.stop(a))
        },
        onMouseOver: function(a) {
            this.event = a,
            this.capture && a.preventDefault(),
            this.input.mousePointer.withinGame = !0,
            this.mouseOverCallback && this.mouseOverCallback.call(this.callbackContext, a)
        },
        onMouseWheel: function(a) {
            this._wheelEvent && (a = this._wheelEvent.bindEvent(a)),
            this.event = a,
            this.capture && a.preventDefault(),
            this.wheelDelta = c.Math.clamp(-a.deltaY, -1, 1),
            this.mouseWheelCallback && this.mouseWheelCallback.call(this.callbackContext, a)
        },
        requestPointerLock: function() {
            if (this.game.device.pointerLock) {
                var a = this.game.canvas;
                a.requestPointerLock = a.requestPointerLock || a.mozRequestPointerLock || a.webkitRequestPointerLock,
                a.requestPointerLock();
                var b = this;
                this._pointerLockChange = function(a) {
                    return b.pointerLockChange(a)
                }
                ,
                document.addEventListener("pointerlockchange", this._pointerLockChange, !0),
                document.addEventListener("mozpointerlockchange", this._pointerLockChange, !0),
                document.addEventListener("webkitpointerlockchange", this._pointerLockChange, !0)
            }
        },
        pointerLockChange: function(a) {
            var b = this.game.canvas;
            document.pointerLockElement === b || document.mozPointerLockElement === b || document.webkitPointerLockElement === b ? (this.locked = !0,
            this.pointerLock.dispatch(!0, a)) : (this.locked = !1,
            this.pointerLock.dispatch(!1, a))
        },
        releasePointerLock: function() {
            document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock,
            document.exitPointerLock(),
            document.removeEventListener("pointerlockchange", this._pointerLockChange, !0),
            document.removeEventListener("mozpointerlockchange", this._pointerLockChange, !0),
            document.removeEventListener("webkitpointerlockchange", this._pointerLockChange, !0)
        },
        stop: function() {
            var a = this.game.canvas;
            a.removeEventListener("mousedown", this._onMouseDown, !0),
            a.removeEventListener("mousemove", this._onMouseMove, !0),
            a.removeEventListener("mouseup", this._onMouseUp, !0),
            a.removeEventListener("mouseover", this._onMouseOver, !0),
            a.removeEventListener("mouseout", this._onMouseOut, !0);
            var b = this.game.device.wheelEvent;
            b && a.removeEventListener(b, this._onMouseWheel, !0),
            window.removeEventListener("mouseup", this._onMouseUpGlobal, !0),
            document.removeEventListener("pointerlockchange", this._pointerLockChange, !0),
            document.removeEventListener("mozpointerlockchange", this._pointerLockChange, !0),
            document.removeEventListener("webkitpointerlockchange", this._pointerLockChange, !0)
        }
    },
    c.Mouse.prototype.constructor = c.Mouse,
    a.prototype = {},
    a.prototype.constructor = a,
    a.prototype.bindEvent = function(b) {
        if (!a._stubsGenerated && b) {
            var c = function(a) {
                return function() {
                    var b = this.originalEvent[a];
                    return "function" != typeof b ? b : b.bind(this.originalEvent)
                }
            };
            for (var d in b)
                d in a.prototype || Object.defineProperty(a.prototype, d, {
                    get: c(d)
                });
            a._stubsGenerated = !0
        }
        return this.originalEvent = b,
        this
    }
    ,
    Object.defineProperties(a.prototype, {
        type: {
            value: "wheel"
        },
        deltaMode: {
            get: function() {
                return this._deltaMode
            }
        },
        deltaY: {
            get: function() {
                return this._scaleFactor * (this.originalEvent.wheelDelta || this.originalEvent.detail) || 0
            }
        },
        deltaX: {
            get: function() {
                return this._scaleFactor * this.originalEvent.wheelDeltaX || 0
            }
        },
        deltaZ: {
            value: 0
        }
    }),
    c.MSPointer = function(a) {
        this.game = a,
        this.input = a.input,
        this.callbackContext = this.game,
        this.pointerDownCallback = null,
        this.pointerMoveCallback = null,
        this.pointerUpCallback = null,
        this.capture = !0,
        this.button = -1,
        this.event = null,
        this.enabled = !0,
        this._onMSPointerDown = null,
        this._onMSPointerMove = null,
        this._onMSPointerUp = null,
        this._onMSPointerUpGlobal = null,
        this._onMSPointerOut = null,
        this._onMSPointerOver = null
    }
    ,
    c.MSPointer.prototype = {
        start: function() {
            if (null === this._onMSPointerDown) {
                var a = this;
                if (this.game.device.mspointer) {
                    this._onMSPointerDown = function(b) {
                        return a.onPointerDown(b)
                    }
                    ,
                    this._onMSPointerMove = function(b) {
                        return a.onPointerMove(b)
                    }
                    ,
                    this._onMSPointerUp = function(b) {
                        return a.onPointerUp(b)
                    }
                    ,
                    this._onMSPointerUpGlobal = function(b) {
                        return a.onPointerUpGlobal(b)
                    }
                    ,
                    this._onMSPointerOut = function(b) {
                        return a.onPointerOut(b)
                    }
                    ,
                    this._onMSPointerOver = function(b) {
                        return a.onPointerOver(b)
                    }
                    ;
                    var b = this.game.canvas;
                    b.addEventListener("MSPointerDown", this._onMSPointerDown, !1),
                    b.addEventListener("MSPointerMove", this._onMSPointerMove, !1),
                    b.addEventListener("MSPointerUp", this._onMSPointerUp, !1),
                    b.addEventListener("pointerdown", this._onMSPointerDown, !1),
                    b.addEventListener("pointermove", this._onMSPointerMove, !1),
                    b.addEventListener("pointerup", this._onMSPointerUp, !1),
                    b.style["-ms-content-zooming"] = "none",
                    b.style["-ms-touch-action"] = "none",
                    this.game.device.cocoonJS || (window.addEventListener("MSPointerUp", this._onMSPointerUpGlobal, !0),
                    b.addEventListener("MSPointerOver", this._onMSPointerOver, !0),
                    b.addEventListener("MSPointerOut", this._onMSPointerOut, !0),
                    window.addEventListener("pointerup", this._onMSPointerUpGlobal, !0),
                    b.addEventListener("pointerover", this._onMSPointerOver, !0),
                    b.addEventListener("pointerout", this._onMSPointerOut, !0))
                }
            }
        },
        onPointerDown: function(a) {
            this.event = a,
            this.capture && a.preventDefault(),
            this.pointerDownCallback && this.pointerDownCallback.call(this.callbackContext, a),
            this.input.enabled && this.enabled && (a.identifier = a.pointerId,
            "mouse" === a.pointerType || 4 === a.pointerType ? this.input.mousePointer.start(a) : this.input.startPointer(a))
        },
        onPointerMove: function(a) {
            this.event = a,
            this.capture && a.preventDefault(),
            this.pointerMoveCallback && this.pointerMoveCallback.call(this.callbackContext, a),
            this.input.enabled && this.enabled && (a.identifier = a.pointerId,
            "mouse" === a.pointerType || 4 === a.pointerType ? this.input.mousePointer.move(a) : this.input.updatePointer(a))
        },
        onPointerUp: function(a) {
            this.event = a,
            this.capture && a.preventDefault(),
            this.pointerUpCallback && this.pointerUpCallback.call(this.callbackContext, a),
            this.input.enabled && this.enabled && (a.identifier = a.pointerId,
            "mouse" === a.pointerType || 4 === a.pointerType ? this.input.mousePointer.stop(a) : this.input.stopPointer(a))
        },
        onPointerUpGlobal: function(a) {
            if ("mouse" !== a.pointerType && 4 !== a.pointerType || this.input.mousePointer.withinGame) {
                var b = this.input.getPointerFromIdentifier(a.identifier);
                b && b.withinGame && this.onPointerUp(a)
            } else
                this.onPointerUp(a)
        },
        onPointerOut: function(a) {
            if (this.event = a,
            this.capture && a.preventDefault(),
            "mouse" === a.pointerType || 4 === a.pointerType)
                this.input.mousePointer.withinGame = !1;
            else {
                var b = this.input.getPointerFromIdentifier(a.identifier);
                b && (b.withinGame = !1)
            }
            this.input.mouse.mouseOutCallback && this.input.mouse.mouseOutCallback.call(this.input.mouse.callbackContext, a),
            this.input.enabled && this.enabled && this.input.mouse.stopOnGameOut && (a.identifier = 0,
            b ? b.stop(a) : this.input.mousePointer.stop(a))
        },
        onPointerOver: function(a) {
            if (this.event = a,
            this.capture && a.preventDefault(),
            "mouse" === a.pointerType || 4 === a.pointerType)
                this.input.mousePointer.withinGame = !0;
            else {
                var b = this.input.getPointerFromIdentifier(a.identifier);
                b && (b.withinGame = !0)
            }
            this.input.mouse.mouseOverCallback && this.input.mouse.mouseOverCallback.call(this.input.mouse.callbackContext, a)
        },
        stop: function() {
            var a = this.game.canvas;
            a.removeEventListener("MSPointerDown", this._onMSPointerDown),
            a.removeEventListener("MSPointerMove", this._onMSPointerMove),
            a.removeEventListener("MSPointerUp", this._onMSPointerUp),
            a.removeEventListener("MSPointerOver", this._onMSPointerOver),
            a.removeEventListener("MSPointerOut", this._onMSPointerOut),
            a.removeEventListener("pointerdown", this._onMSPointerDown),
            a.removeEventListener("pointermove", this._onMSPointerMove),
            a.removeEventListener("pointerup", this._onMSPointerUp),
            a.removeEventListener("pointerover", this._onMSPointerOver),
            a.removeEventListener("pointerout", this._onMSPointerOut),
            window.removeEventListener("MSPointerUp", this._onMSPointerUpGlobal),
            window.removeEventListener("pointerup", this._onMSPointerUpGlobal)
        }
    },
    c.MSPointer.prototype.constructor = c.MSPointer,
    c.DeviceButton = function(a, b) {
        this.parent = a,
        this.game = a.game,
        this.event = null,
        this.isDown = !1,
        this.isUp = !0,
        this.timeDown = 0,
        this.duration = 0,
        this.timeUp = 0,
        this.repeats = 0,
        this.altKey = !1,
        this.shiftKey = !1,
        this.ctrlKey = !1,
        this.value = 0,
        this.buttonCode = b,
        this.onDown = new c.Signal,
        this.onUp = new c.Signal,
        this.onFloat = new c.Signal
    }
    ,
    c.DeviceButton.prototype = {
        start: function(a, b) {
            this.isDown || (this.isDown = !0,
            this.isUp = !1,
            this.timeDown = this.game.time.time,
            this.duration = 0,
            this.repeats = 0,
            this.event = a,
            this.value = b,
            a && (this.altKey = a.altKey,
            this.shiftKey = a.shiftKey,
            this.ctrlKey = a.ctrlKey),
            this.onDown.dispatch(this, b))
        },
        stop: function(a, b) {
            this.isUp || (this.isDown = !1,
            this.isUp = !0,
            this.timeUp = this.game.time.time,
            this.event = a,
            this.value = b,
            a && (this.altKey = a.altKey,
            this.shiftKey = a.shiftKey,
            this.ctrlKey = a.ctrlKey),
            this.onUp.dispatch(this, b))
        },
        padFloat: function(a) {
            this.value = a,
            this.onFloat.dispatch(this, a)
        },
        justPressed: function(a) {
            return a = a || 250,
            this.isDown && this.timeDown + a > this.game.time.time
        },
        justReleased: function(a) {
            return a = a || 250,
            this.isUp && this.timeUp + a > this.game.time.time
        },
        reset: function() {
            this.isDown = !1,
            this.isUp = !0,
            this.timeDown = this.game.time.time,
            this.duration = 0,
            this.repeats = 0,
            this.altKey = !1,
            this.shiftKey = !1,
            this.ctrlKey = !1
        },
        destroy: function() {
            this.onDown.dispose(),
            this.onUp.dispose(),
            this.onFloat.dispose(),
            this.parent = null,
            this.game = null
        }
    },
    c.DeviceButton.prototype.constructor = c.DeviceButton,
    Object.defineProperty(c.DeviceButton.prototype, "duration", {
        get: function() {
            return this.isUp ? -1 : this.game.time.time - this.timeDown
        }
    }),
    c.Pointer = function(a, b) {
        this.game = a,
        this.id = b,
        this.type = c.POINTER,
        this.exists = !0,
        this.identifier = 0,
        this.pointerId = null,
        this.target = null,
        this.button = null,
        this.leftButton = new c.DeviceButton(this,c.Pointer.LEFT_BUTTON),
        this.middleButton = new c.DeviceButton(this,c.Pointer.MIDDLE_BUTTON),
        this.rightButton = new c.DeviceButton(this,c.Pointer.RIGHT_BUTTON),
        this.backButton = new c.DeviceButton(this,c.Pointer.BACK_BUTTON),
        this.forwardButton = new c.DeviceButton(this,c.Pointer.FORWARD_BUTTON),
        this.eraserButton = new c.DeviceButton(this,c.Pointer.ERASER_BUTTON),
        this._holdSent = !1,
        this._history = [],
        this._nextDrop = 0,
        this._stateReset = !1,
        this.withinGame = !1,
        this.clientX = -1,
        this.clientY = -1,
        this.pageX = -1,
        this.pageY = -1,
        this.screenX = -1,
        this.screenY = -1,
        this.rawMovementX = 0,
        this.rawMovementY = 0,
        this.movementX = 0,
        this.movementY = 0,
        this.x = -1,
        this.y = -1,
        this.isMouse = 0 === b,
        this.isDown = !1,
        this.isUp = !0,
        this.timeDown = 0,
        this.timeUp = 0,
        this.previousTapTime = 0,
        this.totalTouches = 0,
        this.msSinceLastClick = Number.MAX_VALUE,
        this.targetObject = null,
        this.active = !1,
        this.dirty = !1,
        this.position = new c.Point,
        this.positionDown = new c.Point,
        this.positionUp = new c.Point,
        this.circle = new c.Circle(0,0,44),
        this._clickTrampolines = null,
        this._trampolineTargetObject = null
    }
    ,
    c.Pointer.NO_BUTTON = 0,
    c.Pointer.LEFT_BUTTON = 1,
    c.Pointer.RIGHT_BUTTON = 2,
    c.Pointer.MIDDLE_BUTTON = 4,
    c.Pointer.BACK_BUTTON = 8,
    c.Pointer.FORWARD_BUTTON = 16,
    c.Pointer.ERASER_BUTTON = 32,
    c.Pointer.prototype = {
        resetButtons: function() {
            this.isDown = !1,
            this.isUp = !0,
            this.isMouse && (this.leftButton.reset(),
            this.middleButton.reset(),
            this.rightButton.reset(),
            this.backButton.reset(),
            this.forwardButton.reset(),
            this.eraserButton.reset())
        },
        processButtonsDown: function(a, b) {
            c.Pointer.LEFT_BUTTON & a && this.leftButton.start(b),
            c.Pointer.RIGHT_BUTTON & a && this.rightButton.start(b),
            c.Pointer.MIDDLE_BUTTON & a && this.middleButton.start(b),
            c.Pointer.BACK_BUTTON & a && this.backButton.start(b),
            c.Pointer.FORWARD_BUTTON & a && this.forwardButton.start(b),
            c.Pointer.ERASER_BUTTON & a && this.eraserButton.start(b)
        },
        processButtonsUp: function(a, b) {
            a === c.Mouse.LEFT_BUTTON && this.leftButton.stop(b),
            a === c.Mouse.RIGHT_BUTTON && this.rightButton.stop(b),
            a === c.Mouse.MIDDLE_BUTTON && this.middleButton.stop(b),
            a === c.Mouse.BACK_BUTTON && this.backButton.stop(b),
            a === c.Mouse.FORWARD_BUTTON && this.forwardButton.stop(b),
            5 === a && this.eraserButton.stop(b)
        },
        updateButtons: function(a) {
            this.button = a.button;
            var b = "down" === a.type.toLowerCase().substr(-4);
            void 0 !== a.buttons ? b ? this.processButtonsDown(a.buttons, a) : this.processButtonsUp(a.button, a) : b ? this.leftButton.start(a) : (this.leftButton.stop(a),
            this.rightButton.stop(a)),
            a.ctrlKey && this.leftButton.isDown && this.rightButton.start(a),
            this.isUp = !0,
            this.isDown = !1,
            (this.leftButton.isDown || this.rightButton.isDown || this.middleButton.isDown || this.backButton.isDown || this.forwardButton.isDown || this.eraserButton.isDown) && (this.isUp = !1,
            this.isDown = !0)
        },
        start: function(a) {
            return a.pointerId && (this.pointerId = a.pointerId),
            this.identifier = a.identifier,
            this.target = a.target,
            this.isMouse ? this.updateButtons(a) : (this.isDown = !0,
            this.isUp = !1),
            this.active = !0,
            this.withinGame = !0,
            this.dirty = !1,
            this._history = [],
            this._clickTrampolines = null,
            this._trampolineTargetObject = null,
            this.msSinceLastClick = this.game.time.time - this.timeDown,
            this.timeDown = this.game.time.time,
            this._holdSent = !1,
            this.move(a, !0),
            this.positionDown.setTo(this.x, this.y),
            (this.game.input.multiInputOverride === c.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride === c.Input.MOUSE_TOUCH_COMBINE || this.game.input.multiInputOverride === c.Input.TOUCH_OVERRIDES_MOUSE && 0 === this.game.input.totalActivePointers) && (this.game.input.x = this.x,
            this.game.input.y = this.y,
            this.game.input.position.setTo(this.x, this.y),
            this.game.input.onDown.dispatch(this, a),
            this.game.input.resetSpeed(this.x, this.y)),
            this._stateReset = !1,
            this.totalTouches++,
            null !== this.targetObject && this.targetObject._touchedHandler(this),
            this
        },
        update: function() {
            this.active && (this.dirty && (this.game.input.interactiveItems.total > 0 && this.processInteractiveObjects(!1),
            this.dirty = !1),
            this._holdSent === !1 && this.duration >= this.game.input.holdRate && ((this.game.input.multiInputOverride === c.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride === c.Input.MOUSE_TOUCH_COMBINE || this.game.input.multiInputOverride === c.Input.TOUCH_OVERRIDES_MOUSE && 0 === this.game.input.totalActivePointers) && this.game.input.onHold.dispatch(this),
            this._holdSent = !0),
            this.game.input.recordPointerHistory && this.game.time.time >= this._nextDrop && (this._nextDrop = this.game.time.time + this.game.input.recordRate,
            this._history.push({
                x: this.position.x,
                y: this.position.y
            }),
            this._history.length > this.game.input.recordLimit && this._history.shift()))
        },
        move: function(a, b) {
            var d = this.game.input;
            if (!d.pollLocked) {
                if (void 0 === b && (b = !1),
                void 0 !== a.button && (this.button = a.button),
                b && this.isMouse && this.updateButtons(a),
                this.clientX = a.clientX,
                this.clientY = a.clientY,
                this.pageX = a.pageX,
                this.pageY = a.pageY,
                this.screenX = a.screenX,
                this.screenY = a.screenY,
                this.isMouse && d.mouse.locked && !b && (this.rawMovementX = a.movementX || a.mozMovementX || a.webkitMovementX || 0,
                this.rawMovementY = a.movementY || a.mozMovementY || a.webkitMovementY || 0,
                this.movementX += this.rawMovementX,
                this.movementY += this.rawMovementY),
                this.x = (this.pageX - this.game.scale.offset.x) * d.scale.x,
                this.y = (this.pageY - this.game.scale.offset.y) * d.scale.y,
                this.position.setTo(this.x, this.y),
                this.circle.x = this.x,
                this.circle.y = this.y,
                (d.multiInputOverride === c.Input.MOUSE_OVERRIDES_TOUCH || d.multiInputOverride === c.Input.MOUSE_TOUCH_COMBINE || d.multiInputOverride === c.Input.TOUCH_OVERRIDES_MOUSE && 0 === d.totalActivePointers) && (d.activePointer = this,
                d.x = this.x,
                d.y = this.y,
                d.position.setTo(d.x, d.y),
                d.circle.x = d.x,
                d.circle.y = d.y),
                this.withinGame = this.game.scale.bounds.contains(this.pageX, this.pageY),
                this.game.paused)
                    return this;
                for (var e = d.moveCallbacks.length; e--; )
                    d.moveCallbacks[e].callback.call(d.moveCallbacks[e].context, this, this.x, this.y, b);
                return null !== this.targetObject && this.targetObject.isDragged === !0 ? this.targetObject.update(this) === !1 && (this.targetObject = null) : d.interactiveItems.total > 0 && this.processInteractiveObjects(b),
                this
            }
        },
        processInteractiveObjects: function(a) {
            for (var b = Number.MAX_VALUE, c = -1, d = null, e = this.game.input.interactiveItems.first; e; )
                e.checked = !1,
                e.validForInput(c, b, !1) && (e.checked = !0,
                (a && e.checkPointerDown(this, !0) || !a && e.checkPointerOver(this, !0)) && (b = e.sprite.renderOrderID,
                c = e.priorityID,
                d = e)),
                e = this.game.input.interactiveItems.next;
            for (var e = this.game.input.interactiveItems.first; e; )
                !e.checked && e.validForInput(c, b, !0) && (a && e.checkPointerDown(this, !1) || !a && e.checkPointerOver(this, !1)) && (b = e.sprite.renderOrderID,
                c = e.priorityID,
                d = e),
                e = this.game.input.interactiveItems.next;
            return null === d ? this.targetObject && (this.targetObject._pointerOutHandler(this),
            this.targetObject = null) : null === this.targetObject ? (this.targetObject = d,
            d._pointerOverHandler(this)) : this.targetObject === d ? d.update(this) === !1 && (this.targetObject = null) : (this.targetObject._pointerOutHandler(this),
            this.targetObject = d,
            this.targetObject._pointerOverHandler(this)),
            null !== this.targetObject
        },
        leave: function(a) {
            this.withinGame = !1,
            this.move(a, !1)
        },
        stop: function(a) {
            return this._stateReset && this.withinGame ? void a.preventDefault() : (this.timeUp = this.game.time.time,
            (this.game.input.multiInputOverride === c.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride === c.Input.MOUSE_TOUCH_COMBINE || this.game.input.multiInputOverride === c.Input.TOUCH_OVERRIDES_MOUSE && 0 === this.game.input.totalActivePointers) && (this.game.input.onUp.dispatch(this, a),
            this.duration >= 0 && this.duration <= this.game.input.tapRate && (this.timeUp - this.previousTapTime < this.game.input.doubleTapRate ? this.game.input.onTap.dispatch(this, !0) : this.game.input.onTap.dispatch(this, !1),
            this.previousTapTime = this.timeUp)),
            this.isMouse ? this.updateButtons(a) : (this.isDown = !1,
            this.isUp = !0),
            this.id > 0 && (this.active = !1),
            this.withinGame = this.game.scale.bounds.contains(a.pageX, a.pageY),
            this.pointerId = null,
            this.identifier = null,
            this.positionUp.setTo(this.x, this.y),
            this.isMouse === !1 && this.game.input.currentPointers--,
            this.game.input.interactiveItems.callAll("_releasedHandler", this),
            this._clickTrampolines && (this._trampolineTargetObject = this.targetObject),
            this.targetObject = null,
            this)
        },
        justPressed: function(a) {
            return a = a || this.game.input.justPressedRate,
            this.isDown === !0 && this.timeDown + a > this.game.time.time
        },
        justReleased: function(a) {
            return a = a || this.game.input.justReleasedRate,
            this.isUp && this.timeUp + a > this.game.time.time
        },
        addClickTrampoline: function(a, b, c, d) {
            if (this.isDown) {
                for (var e = this._clickTrampolines = this._clickTrampolines || [], f = 0; f < e.length; f++)
                    if (e[f].name === a) {
                        e.splice(f, 1);
                        break
                    }
                e.push({
                    name: a,
                    targetObject: this.targetObject,
                    callback: b,
                    callbackContext: c,
                    callbackArgs: d
                })
            }
        },
        processClickTrampolines: function() {
            var a = this._clickTrampolines;
            if (a) {
                for (var b = 0; b < a.length; b++) {
                    var c = a[b];
                    c.targetObject === this._trampolineTargetObject && c.callback.apply(c.callbackContext, c.callbackArgs)
                }
                this._clickTrampolines = null,
                this._trampolineTargetObject = null
            }
        },
        reset: function() {
            this.isMouse === !1 && (this.active = !1),
            this.pointerId = null,
            this.identifier = null,
            this.dirty = !1,
            this.totalTouches = 0,
            this._holdSent = !1,
            this._history.length = 0,
            this._stateReset = !0,
            this.resetButtons(),
            this.targetObject && this.targetObject._releasedHandler(this),
            this.targetObject = null
        },
        resetMovement: function() {
            this.movementX = 0,
            this.movementY = 0
        }
    },
    c.Pointer.prototype.constructor = c.Pointer,
    Object.defineProperty(c.Pointer.prototype, "duration", {
        get: function() {
            return this.isUp ? -1 : this.game.time.time - this.timeDown
        }
    }),
    Object.defineProperty(c.Pointer.prototype, "worldX", {
        get: function() {
            return this.game.world.camera.x + this.x
        }
    }),
    Object.defineProperty(c.Pointer.prototype, "worldY", {
        get: function() {
            return this.game.world.camera.y + this.y
        }
    }),
    c.Touch = function(a) {
        this.game = a,
        this.enabled = !0,
        this.touchLockCallbacks = [],
        this.callbackContext = this.game,
        this.touchStartCallback = null,
        this.touchMoveCallback = null,
        this.touchEndCallback = null,
        this.touchEnterCallback = null,
        this.touchLeaveCallback = null,
        this.touchCancelCallback = null,
        this.preventDefault = !0,
        this.event = null,
        this._onTouchStart = null,
        this._onTouchMove = null,
        this._onTouchEnd = null,
        this._onTouchEnter = null,
        this._onTouchLeave = null,
        this._onTouchCancel = null,
        this._onTouchMove = null
    }
    ,
    c.Touch.prototype = {
        start: function() {
            if (null === this._onTouchStart) {
                var a = this;
                this.game.device.touch && (this._onTouchStart = function(b) {
                    return a.onTouchStart(b)
                }
                ,
                this._onTouchMove = function(b) {
                    return a.onTouchMove(b)
                }
                ,
                this._onTouchEnd = function(b) {
                    return a.onTouchEnd(b)
                }
                ,
                this._onTouchEnter = function(b) {
                    return a.onTouchEnter(b)
                }
                ,
                this._onTouchLeave = function(b) {
                    return a.onTouchLeave(b)
                }
                ,
                this._onTouchCancel = function(b) {
                    return a.onTouchCancel(b)
                }
                ,
                this.game.canvas.addEventListener("touchstart", this._onTouchStart, !1),
                this.game.canvas.addEventListener("touchmove", this._onTouchMove, !1),
                this.game.canvas.addEventListener("touchend", this._onTouchEnd, !1),
                this.game.canvas.addEventListener("touchcancel", this._onTouchCancel, !1),
                this.game.device.cocoonJS || (this.game.canvas.addEventListener("touchenter", this._onTouchEnter, !1),
                this.game.canvas.addEventListener("touchleave", this._onTouchLeave, !1)))
            }
        },
        consumeDocumentTouches: function() {
            this._documentTouchMove = function(a) {
                a.preventDefault()
            }
            ,
            document.addEventListener("touchmove", this._documentTouchMove, !1)
        },
        addTouchLockCallback: function(a, b) {
            this.touchLockCallbacks.push({
                callback: a,
                context: b
            })
        },
        removeTouchLockCallback: function(a, b) {
            for (var c = this.touchLockCallbacks.length; c--; )
                if (this.touchLockCallbacks[c].callback === a && this.touchLockCallbacks[c].context === b)
                    return this.touchLockCallbacks.splice(c, 1),
                    !0;
            return !1
        },
        onTouchStart: function(a) {
            for (var b = this.touchLockCallbacks.length; b--; )
                this.touchLockCallbacks[b].callback.call(this.touchLockCallbacks[b].context, this, a) && this.touchLockCallbacks.splice(b, 1);
            if (this.event = a,
            this.game.input.enabled && this.enabled) {
                this.touchStartCallback && this.touchStartCallback.call(this.callbackContext, a),
                this.preventDefault && a.preventDefault();
                for (var b = 0; b < a.changedTouches.length; b++)
                    this.game.input.startPointer(a.changedTouches[b])
            }
        },
        onTouchCancel: function(a) {
            if (this.event = a,
            this.touchCancelCallback && this.touchCancelCallback.call(this.callbackContext, a),
            this.game.input.enabled && this.enabled) {
                this.preventDefault && a.preventDefault();
                for (var b = 0; b < a.changedTouches.length; b++)
                    this.game.input.stopPointer(a.changedTouches[b])
            }
        },
        onTouchEnter: function(a) {
            this.event = a,
            this.touchEnterCallback && this.touchEnterCallback.call(this.callbackContext, a),
            this.game.input.enabled && this.enabled && this.preventDefault && a.preventDefault()
        },
        onTouchLeave: function(a) {
            this.event = a,
            this.touchLeaveCallback && this.touchLeaveCallback.call(this.callbackContext, a),
            this.preventDefault && a.preventDefault()
        },
        onTouchMove: function(a) {
            this.event = a,
            this.touchMoveCallback && this.touchMoveCallback.call(this.callbackContext, a),
            this.preventDefault && a.preventDefault();
            for (var b = 0; b < a.changedTouches.length; b++)
                this.game.input.updatePointer(a.changedTouches[b])
        },
        onTouchEnd: function(a) {
            this.event = a,
            this.touchEndCallback && this.touchEndCallback.call(this.callbackContext, a),
            this.preventDefault && a.preventDefault();
            for (var b = 0; b < a.changedTouches.length; b++)
                this.game.input.stopPointer(a.changedTouches[b])
        },
        stop: function() {
            this.game.device.touch && (this.game.canvas.removeEventListener("touchstart", this._onTouchStart),
            this.game.canvas.removeEventListener("touchmove", this._onTouchMove),
            this.game.canvas.removeEventListener("touchend", this._onTouchEnd),
            this.game.canvas.removeEventListener("touchenter", this._onTouchEnter),
            this.game.canvas.removeEventListener("touchleave", this._onTouchLeave),
            this.game.canvas.removeEventListener("touchcancel", this._onTouchCancel))
        }
    },
    c.Touch.prototype.constructor = c.Touch,
    c.InputHandler = function(a) {
        this.sprite = a,
        this.game = a.game,
        this.enabled = !1,
        this.checked = !1,
        this.priorityID = 0,
        this.useHandCursor = !1,
        this._setHandCursor = !1,
        this.isDragged = !1,
        this.allowHorizontalDrag = !0,
        this.allowVerticalDrag = !0,
        this.bringToTop = !1,
        this.snapOffset = null,
        this.snapOnDrag = !1,
        this.snapOnRelease = !1,
        this.snapX = 0,
        this.snapY = 0,
        this.snapOffsetX = 0,
        this.snapOffsetY = 0,
        this.pixelPerfectOver = !1,
        this.pixelPerfectClick = !1,
        this.pixelPerfectAlpha = 255,
        this.draggable = !1,
        this.boundsRect = null,
        this.boundsSprite = null,
        this.consumePointerEvent = !1,
        this.scaleLayer = !1,
        this.dragOffset = new c.Point,
        this.dragFromCenter = !1,
        this.dragStartPoint = new c.Point,
        this.snapPoint = new c.Point,
        this._dragPoint = new c.Point,
        this._dragPhase = !1,
        this._wasEnabled = !1,
        this._tempPoint = new c.Point,
        this._pointerData = [],
        this._pointerData.push({
            id: 0,
            x: 0,
            y: 0,
            isDown: !1,
            isUp: !1,
            isOver: !1,
            isOut: !1,
            timeOver: 0,
            timeOut: 0,
            timeDown: 0,
            timeUp: 0,
            downDuration: 0,
            isDragged: !1
        })
    }
    ,
    c.InputHandler.prototype = {
        start: function(a, b) {
            if (a = a || 0,
            void 0 === b && (b = !1),
            this.enabled === !1) {
                this.game.input.interactiveItems.add(this),
                this.useHandCursor = b,
                this.priorityID = a;
                for (var d = 0; 10 > d; d++)
                    this._pointerData[d] = {
                        id: d,
                        x: 0,
                        y: 0,
                        isDown: !1,
                        isUp: !1,
                        isOver: !1,
                        isOut: !1,
                        timeOver: 0,
                        timeOut: 0,
                        timeDown: 0,
                        timeUp: 0,
                        downDuration: 0,
                        isDragged: !1
                    };
                this.snapOffset = new c.Point,
                this.enabled = !0,
                this._wasEnabled = !0
            }
            return this.sprite.events.onAddedToGroup.add(this.addedToGroup, this),
            this.sprite.events.onRemovedFromGroup.add(this.removedFromGroup, this),
            this.flagged = !1,
            this.sprite
        },
        addedToGroup: function() {
            this._dragPhase || this._wasEnabled && !this.enabled && this.start()
        },
        removedFromGroup: function() {
            this._dragPhase || (this.enabled ? (this._wasEnabled = !0,
            this.stop()) : this._wasEnabled = !1)
        },
        reset: function() {
            this.enabled = !1,
            this.flagged = !1;
            for (var a = 0; 10 > a; a++)
                this._pointerData[a] = {
                    id: a,
                    x: 0,
                    y: 0,
                    isDown: !1,
                    isUp: !1,
                    isOver: !1,
                    isOut: !1,
                    timeOver: 0,
                    timeOut: 0,
                    timeDown: 0,
                    timeUp: 0,
                    downDuration: 0,
                    isDragged: !1
                }
        },
        stop: function() {
            this.enabled !== !1 && (this.enabled = !1,
            this.game.input.interactiveItems.remove(this))
        },
        destroy: function() {
            this.sprite && (this._setHandCursor && (this.game.canvas.style.cursor = "default",
            this._setHandCursor = !1),
            this.enabled = !1,
            this.game.input.interactiveItems.remove(this),
            this._pointerData.length = 0,
            this.boundsRect = null,
            this.boundsSprite = null,
            this.sprite = null)
        },
        validForInput: function(a, b, c) {
            return void 0 === c && (c = !0),
            0 === this.sprite.scale.x || 0 === this.sprite.scale.y || this.priorityID < this.game.input.minPriorityID ? !1 : (c || !this.pixelPerfectClick && !this.pixelPerfectOver) && (this.priorityID > a || this.priorityID === a && this.sprite.renderOrderID < b) ? !0 : !1
        },
        isPixelPerfect: function() {
            return this.pixelPerfectClick || this.pixelPerfectOver
        },
        pointerX: function(a) {
            return a = a || 0,
            this._pointerData[a].x
        },
        pointerY: function(a) {
            return a = a || 0,
            this._pointerData[a].y
        },
        pointerDown: function(a) {
            return a = a || 0,
            this._pointerData[a].isDown
        },
        pointerUp: function(a) {
            return a = a || 0,
            this._pointerData[a].isUp
        },
        pointerTimeDown: function(a) {
            return a = a || 0,
            this._pointerData[a].timeDown
        },
        pointerTimeUp: function(a) {
            return a = a || 0,
            this._pointerData[a].timeUp
        },
        pointerOver: function(a) {
            if (this.enabled) {
                if (void 0 !== a)
                    return this._pointerData[a].isOver;
                for (var b = 0; 10 > b; b++)
                    if (this._pointerData[b].isOver)
                        return !0
            }
            return !1
        },
        pointerOut: function(a) {
            if (this.enabled) {
                if (void 0 !== a)
                    return this._pointerData[a].isOut;
                for (var b = 0; 10 > b; b++)
                    if (this._pointerData[b].isOut)
                        return !0
            }
            return !1
        },
        pointerTimeOver: function(a) {
            return a = a || 0,
            this._pointerData[a].timeOver
        },
        pointerTimeOut: function(a) {
            return a = a || 0,
            this._pointerData[a].timeOut
        },
        pointerDragged: function(a) {
            return a = a || 0,
            this._pointerData[a].isDragged
        },
        checkPointerDown: function(a, b) {
            return a.isDown && this.enabled && this.sprite && this.sprite.parent && this.sprite.visible && this.sprite.parent.visible && this.game.input.hitTest(this.sprite, a, this._tempPoint) ? (void 0 === b && (b = !1),
            !b && this.pixelPerfectClick ? this.checkPixel(this._tempPoint.x, this._tempPoint.y) : !0) : !1
        },
        checkPointerOver: function(a, b) {
            return this.enabled && this.sprite && this.sprite.parent && this.sprite.visible && this.sprite.parent.visible && this.game.input.hitTest(this.sprite, a, this._tempPoint) ? (void 0 === b && (b = !1),
            !b && this.pixelPerfectOver ? this.checkPixel(this._tempPoint.x, this._tempPoint.y) : !0) : !1
        },
        checkPixel: function(a, b, c) {
            if (this.sprite.texture.baseTexture.source) {
                if (null === a && null === b) {
                    this.game.input.getLocalPosition(this.sprite, c, this._tempPoint);
                    var a = this._tempPoint.x
                      , b = this._tempPoint.y
                }
                if (0 !== this.sprite.anchor.x && (a -= -this.sprite.texture.frame.width * this.sprite.anchor.x),
                0 !== this.sprite.anchor.y && (b -= -this.sprite.texture.frame.height * this.sprite.anchor.y),
                a += this.sprite.texture.frame.x,
                b += this.sprite.texture.frame.y,
                this.sprite.texture.trim && (a -= this.sprite.texture.trim.x,
                b -= this.sprite.texture.trim.y,
                a < this.sprite.texture.crop.x || a > this.sprite.texture.crop.right || b < this.sprite.texture.crop.y || b > this.sprite.texture.crop.bottom))
                    return this._dx = a,
                    this._dy = b,
                    !1;
                this._dx = a,
                this._dy = b,
                this.game.input.hitContext.clearRect(0, 0, 1, 1),
                this.game.input.hitContext.drawImage(this.sprite.texture.baseTexture.source, a, b, 1, 1, 0, 0, 1, 1);
                var d = this.game.input.hitContext.getImageData(0, 0, 1, 1);
                if (d.data[3] >= this.pixelPerfectAlpha)
                    return !0
            }
            return !1
        },
        update: function(a) {
            return null !== this.sprite && void 0 !== this.sprite.parent ? this.enabled && this.sprite.visible && this.sprite.parent.visible ? this.draggable && this._draggedPointerID === a.id ? this.updateDrag(a) : this._pointerData[a.id].isOver ? this.checkPointerOver(a) ? (this._pointerData[a.id].x = a.x - this.sprite.x,
            this._pointerData[a.id].y = a.y - this.sprite.y,
            !0) : (this._pointerOutHandler(a),
            !1) : void 0 : (this._pointerOutHandler(a),
            !1) : void 0
        },
        _pointerOverHandler: function(a) {
            if (null !== this.sprite) {
                var b = this._pointerData[a.id];
                (b.isOver === !1 || a.dirty) && (b.isOver = !0,
                b.isOut = !1,
                b.timeOver = this.game.time.time,
                b.x = a.x - this.sprite.x,
                b.y = a.y - this.sprite.y,
                this.useHandCursor && b.isDragged === !1 && (this.game.canvas.style.cursor = "pointer",
                this._setHandCursor = !0),
                this.sprite && this.sprite.events && this.sprite.events.onInputOver$dispatch(this.sprite, a))
            }
        },
        _pointerOutHandler: function(a) {
            if (null !== this.sprite) {
                var b = this._pointerData[a.id];
                b.isOver = !1,
                b.isOut = !0,
                b.timeOut = this.game.time.time,
                this.useHandCursor && b.isDragged === !1 && (this.game.canvas.style.cursor = "default",
                this._setHandCursor = !1),
                this.sprite && this.sprite.events && this.sprite.events.onInputOut$dispatch(this.sprite, a)
            }
        },
        _touchedHandler: function(a) {
            if (null !== this.sprite) {
                var b = this._pointerData[a.id];
                if (!b.isDown && b.isOver) {
                    if (this.pixelPerfectClick && !this.checkPixel(null, null, a))
                        return;
                    b.isDown = !0,
                    b.isUp = !1,
                    b.timeDown = this.game.time.time,
                    this.sprite && this.sprite.events && this.sprite.events.onInputDown$dispatch(this.sprite, a),
                    a.dirty = !0,
                    this.draggable && this.isDragged === !1 && this.startDrag(a),
                    this.bringToTop && this.sprite.bringToTop()
                }
                return this.consumePointerEvent
            }
        },
        _releasedHandler: function(a) {
            if (null !== this.sprite) {
                var b = this._pointerData[a.id];
                if (b.isDown && a.isUp) {
                    b.isDown = !1,
                    b.isUp = !0,
                    b.timeUp = this.game.time.time,
                    b.downDuration = b.timeUp - b.timeDown;
                    var c = this.checkPointerOver(a);
                    this.sprite && this.sprite.events && (this.sprite.events.onInputUp$dispatch(this.sprite, a, c),
                    c && (c = this.checkPointerOver(a))),
                    b.isOver = c,
                    !c && this.useHandCursor && (this.game.canvas.style.cursor = "default",
                    this._setHandCursor = !1),
                    a.dirty = !0,
                    this.draggable && this.isDragged && this._draggedPointerID === a.id && this.stopDrag(a)
                }
            }
        },
        updateDrag: function(a) {
            if (a.isUp)
                return this.stopDrag(a),
                !1;
            var b = this.globalToLocalX(a.x) + this._dragPoint.x + this.dragOffset.x
              , c = this.globalToLocalY(a.y) + this._dragPoint.y + this.dragOffset.y;
            return this.sprite.fixedToCamera ? (this.allowHorizontalDrag && (this.sprite.cameraOffset.x = b),
            this.allowVerticalDrag && (this.sprite.cameraOffset.y = c),
            this.boundsRect && this.checkBoundsRect(),
            this.boundsSprite && this.checkBoundsSprite(),
            this.snapOnDrag && (this.sprite.cameraOffset.x = Math.round((this.sprite.cameraOffset.x - this.snapOffsetX % this.snapX) / this.snapX) * this.snapX + this.snapOffsetX % this.snapX,
            this.sprite.cameraOffset.y = Math.round((this.sprite.cameraOffset.y - this.snapOffsetY % this.snapY) / this.snapY) * this.snapY + this.snapOffsetY % this.snapY,
            this.snapPoint.set(this.sprite.cameraOffset.x, this.sprite.cameraOffset.y))) : (this.allowHorizontalDrag && (this.sprite.x = b),
            this.allowVerticalDrag && (this.sprite.y = c),
            this.boundsRect && this.checkBoundsRect(),
            this.boundsSprite && this.checkBoundsSprite(),
            this.snapOnDrag && (this.sprite.x = Math.round((this.sprite.x - this.snapOffsetX % this.snapX) / this.snapX) * this.snapX + this.snapOffsetX % this.snapX,
            this.sprite.y = Math.round((this.sprite.y - this.snapOffsetY % this.snapY) / this.snapY) * this.snapY + this.snapOffsetY % this.snapY,
            this.snapPoint.set(this.sprite.x, this.sprite.y))),
            this.sprite.events.onDragUpdate.dispatch(this.sprite, a, b, c, this.snapPoint),
            !0
        },
        justOver: function(a, b) {
            return a = a || 0,
            b = b || 500,
            this._pointerData[a].isOver && this.overDuration(a) < b
        },
        justOut: function(a, b) {
            return a = a || 0,
            b = b || 500,
            this._pointerData[a].isOut && this.game.time.time - this._pointerData[a].timeOut < b
        },
        justPressed: function(a, b) {
            return a = a || 0,
            b = b || 500,
            this._pointerData[a].isDown && this.downDuration(a) < b
        },
        justReleased: function(a, b) {
            return a = a || 0,
            b = b || 500,
            this._pointerData[a].isUp && this.game.time.time - this._pointerData[a].timeUp < b
        },
        overDuration: function(a) {
            return a = a || 0,
            this._pointerData[a].isOver ? this.game.time.time - this._pointerData[a].timeOver : -1
        },
        downDuration: function(a) {
            return a = a || 0,
            this._pointerData[a].isDown ? this.game.time.time - this._pointerData[a].timeDown : -1
        },
        enableDrag: function(a, b, d, e, f, g) {
            void 0 === a && (a = !1),
            void 0 === b && (b = !1),
            void 0 === d && (d = !1),
            void 0 === e && (e = 255),
            void 0 === f && (f = null),
            void 0 === g && (g = null),
            this._dragPoint = new c.Point,
            this.draggable = !0,
            this.bringToTop = b,
            this.dragOffset = new c.Point,
            this.dragFromCenter = a,
            this.pixelPerfectClick = d,
            this.pixelPerfectAlpha = e,
            f && (this.boundsRect = f),
            g && (this.boundsSprite = g)
        },
        disableDrag: function() {
            if (this._pointerData)
                for (var a = 0; 10 > a; a++)
                    this._pointerData[a].isDragged = !1;
            this.draggable = !1,
            this.isDragged = !1,
            this._draggedPointerID = -1
        },
        startDrag: function(a) {
            var b = this.sprite.x
              , c = this.sprite.y;
            if (this.isDragged = !0,
            this._draggedPointerID = a.id,
            this._pointerData[a.id].isDragged = !0,
            this.sprite.fixedToCamera)
                this.dragFromCenter ? (this.sprite.centerOn(a.x, a.y),
                this._dragPoint.setTo(this.sprite.cameraOffset.x - a.x, this.sprite.cameraOffset.y - a.y)) : this._dragPoint.setTo(this.sprite.cameraOffset.x - a.x, this.sprite.cameraOffset.y - a.y);
            else {
                if (this.dragFromCenter) {
                    var d = this.sprite.getBounds();
                    this.sprite.x = this.globalToLocalX(a.x) + (this.sprite.x - d.centerX),
                    this.sprite.y = this.globalToLocalY(a.y) + (this.sprite.y - d.centerY)
                }
                this._dragPoint.setTo(this.sprite.x - this.globalToLocalX(a.x), this.sprite.y - this.globalToLocalY(a.y))
            }
            this.updateDrag(a),
            this.bringToTop && (this._dragPhase = !0,
            this.sprite.bringToTop()),
            this.dragStartPoint.set(b, c),
            this.sprite.events.onDragStart$dispatch(this.sprite, a, b, c)
        },
        globalToLocalX: function(a) {
            return this.scaleLayer && (a -= this.game.scale.grid.boundsFluid.x,
            a *= this.game.scale.grid.scaleFluidInversed.x),
            a
        },
        globalToLocalY: function(a) {
            return this.scaleLayer && (a -= this.game.scale.grid.boundsFluid.y,
            a *= this.game.scale.grid.scaleFluidInversed.y),
            a
        },
        stopDrag: function(a) {
            this.isDragged = !1,
            this._draggedPointerID = -1,
            this._pointerData[a.id].isDragged = !1,
            this._dragPhase = !1,
            this.snapOnRelease && (this.sprite.fixedToCamera ? (this.sprite.cameraOffset.x = Math.round((this.sprite.cameraOffset.x - this.snapOffsetX % this.snapX) / this.snapX) * this.snapX + this.snapOffsetX % this.snapX,
            this.sprite.cameraOffset.y = Math.round((this.sprite.cameraOffset.y - this.snapOffsetY % this.snapY) / this.snapY) * this.snapY + this.snapOffsetY % this.snapY) : (this.sprite.x = Math.round((this.sprite.x - this.snapOffsetX % this.snapX) / this.snapX) * this.snapX + this.snapOffsetX % this.snapX,
            this.sprite.y = Math.round((this.sprite.y - this.snapOffsetY % this.snapY) / this.snapY) * this.snapY + this.snapOffsetY % this.snapY)),
            this.sprite.events.onDragStop$dispatch(this.sprite, a),
            this.checkPointerOver(a) === !1 && this._pointerOutHandler(a)
        },
        setDragLock: function(a, b) {
            void 0 === a && (a = !0),
            void 0 === b && (b = !0),
            this.allowHorizontalDrag = a,
            this.allowVerticalDrag = b
        },
        enableSnap: function(a, b, c, d, e, f) {
            void 0 === c && (c = !0),
            void 0 === d && (d = !1),
            void 0 === e && (e = 0),
            void 0 === f && (f = 0),
            this.snapX = a,
            this.snapY = b,
            this.snapOffsetX = e,
            this.snapOffsetY = f,
            this.snapOnDrag = c,
            this.snapOnRelease = d
        },
        disableSnap: function() {
            this.snapOnDrag = !1,
            this.snapOnRelease = !1
        },
        checkBoundsRect: function() {
            this.sprite.fixedToCamera ? (this.sprite.cameraOffset.x < this.boundsRect.left ? this.sprite.cameraOffset.x = this.boundsRect.left : this.sprite.cameraOffset.x + this.sprite.width > this.boundsRect.right && (this.sprite.cameraOffset.x = this.boundsRect.right - this.sprite.width),
            this.sprite.cameraOffset.y < this.boundsRect.top ? this.sprite.cameraOffset.y = this.boundsRect.top : this.sprite.cameraOffset.y + this.sprite.height > this.boundsRect.bottom && (this.sprite.cameraOffset.y = this.boundsRect.bottom - this.sprite.height)) : (this.sprite.left < this.boundsRect.left ? this.sprite.x = this.boundsRect.x + this.sprite.offsetX : this.sprite.right > this.boundsRect.right && (this.sprite.x = this.boundsRect.right - (this.sprite.width - this.sprite.offsetX)),
            this.sprite.top < this.boundsRect.top ? this.sprite.y = this.boundsRect.top + this.sprite.offsetY : this.sprite.bottom > this.boundsRect.bottom && (this.sprite.y = this.boundsRect.bottom - (this.sprite.height - this.sprite.offsetY)))
        },
        checkBoundsSprite: function() {
            this.sprite.fixedToCamera && this.boundsSprite.fixedToCamera ? (this.sprite.cameraOffset.x < this.boundsSprite.cameraOffset.x ? this.sprite.cameraOffset.x = this.boundsSprite.cameraOffset.x : this.sprite.cameraOffset.x + this.sprite.width > this.boundsSprite.cameraOffset.x + this.boundsSprite.width && (this.sprite.cameraOffset.x = this.boundsSprite.cameraOffset.x + this.boundsSprite.width - this.sprite.width),
            this.sprite.cameraOffset.y < this.boundsSprite.cameraOffset.y ? this.sprite.cameraOffset.y = this.boundsSprite.cameraOffset.y : this.sprite.cameraOffset.y + this.sprite.height > this.boundsSprite.cameraOffset.y + this.boundsSprite.height && (this.sprite.cameraOffset.y = this.boundsSprite.cameraOffset.y + this.boundsSprite.height - this.sprite.height)) : (this.sprite.left < this.boundsSprite.left ? this.sprite.x = this.boundsSprite.left + this.sprite.offsetX : this.sprite.right > this.boundsSprite.right && (this.sprite.x = this.boundsSprite.right - (this.sprite.width - this.sprite.offsetX)),
            this.sprite.top < this.boundsSprite.top ? this.sprite.y = this.boundsSprite.top + this.sprite.offsetY : this.sprite.bottom > this.boundsSprite.bottom && (this.sprite.y = this.boundsSprite.bottom - (this.sprite.height - this.sprite.offsetY)))
        }
    },
    c.InputHandler.prototype.constructor = c.InputHandler,
    c.Gamepad = function(a) {
        this.game = a,
        this._gamepadIndexMap = {},
        this._rawPads = [],
        this._active = !1,
        this.enabled = !0,
        this._gamepadSupportAvailable = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads || -1 != navigator.userAgent.indexOf("Firefox/") || !!navigator.getGamepads,
        this._prevRawGamepadTypes = [],
        this._prevTimestamps = [],
        this.callbackContext = this,
        this.onConnectCallback = null,
        this.onDisconnectCallback = null,
        this.onDownCallback = null,
        this.onUpCallback = null,
        this.onAxisCallback = null,
        this.onFloatCallback = null,
        this._ongamepadconnected = null,
        this._gamepaddisconnected = null,
        this._gamepads = [new c.SinglePad(a,this), new c.SinglePad(a,this), new c.SinglePad(a,this), new c.SinglePad(a,this)]
    }
    ,
    c.Gamepad.prototype = {
        addCallbacks: function(a, b) {
            "undefined" != typeof b && (this.onConnectCallback = "function" == typeof b.onConnect ? b.onConnect : this.onConnectCallback,
            this.onDisconnectCallback = "function" == typeof b.onDisconnect ? b.onDisconnect : this.onDisconnectCallback,
            this.onDownCallback = "function" == typeof b.onDown ? b.onDown : this.onDownCallback,
            this.onUpCallback = "function" == typeof b.onUp ? b.onUp : this.onUpCallback,
            this.onAxisCallback = "function" == typeof b.onAxis ? b.onAxis : this.onAxisCallback,
            this.onFloatCallback = "function" == typeof b.onFloat ? b.onFloat : this.onFloatCallback,
            this.callbackContext = a)
        },
        start: function() {
            if (!this._active) {
                this._active = !0;
                var a = this;
                this._onGamepadConnected = function(b) {
                    return a.onGamepadConnected(b)
                }
                ,
                this._onGamepadDisconnected = function(b) {
                    return a.onGamepadDisconnected(b)
                }
                ,
                window.addEventListener("gamepadconnected", this._onGamepadConnected, !1),
                window.addEventListener("gamepaddisconnected", this._onGamepadDisconnected, !1)
            }
        },
        onGamepadConnected: function(a) {
            var b = a.gamepad;
            this._rawPads.push(b),
            this._gamepads[b.index].connect(b)
        },
        onGamepadDisconnected: function(a) {
            var b = a.gamepad;
            for (var c in this._rawPads)
                this._rawPads[c].index === b.index && this._rawPads.splice(c, 1);
            this._gamepads[b.index].disconnect()
        },
        update: function() {
            this._pollGamepads(),
            this.pad1.pollStatus(),
            this.pad2.pollStatus(),
            this.pad3.pollStatus(),
            this.pad4.pollStatus()
        },
        _pollGamepads: function() {
            if (navigator.getGamepads)
                var a = navigator.getGamepads();
            else if (navigator.webkitGetGamepads)
                var a = navigator.webkitGetGamepads();
            else if (navigator.webkitGamepads)
                var a = navigator.webkitGamepads();
            if (a) {
                this._rawPads = [];
                for (var b = !1, c = 0; c < a.length && (typeof a[c] !== this._prevRawGamepadTypes[c] && (b = !0,
                this._prevRawGamepadTypes[c] = typeof a[c]),
                a[c] && this._rawPads.push(a[c]),
                3 !== c); c++)
                    ;
                if (b) {
                    for (var d, e = {
                        rawIndices: {},
                        padIndices: {}
                    }, f = 0; f < this._gamepads.length; f++)
                        if (d = this._gamepads[f],
                        d.connected)
                            for (var g = 0; g < this._rawPads.length; g++)
                                this._rawPads[g].index === d.index && (e.rawIndices[d.index] = !0,
                                e.padIndices[f] = !0);
                    for (var h = 0; h < this._gamepads.length; h++)
                        if (d = this._gamepads[h],
                        !e.padIndices[h]) {
                            this._rawPads.length < 1 && d.disconnect();
                            for (var i = 0; i < this._rawPads.length && !e.padIndices[h]; i++) {
                                var j = this._rawPads[i];
                                if (j) {
                                    if (e.rawIndices[j.index]) {
                                        d.disconnect();
                                        continue
                                    }
                                    d.connect(j),
                                    e.rawIndices[j.index] = !0,
                                    e.padIndices[h] = !0
                                } else
                                    d.disconnect()
                            }
                        }
                }
            }
        },
        setDeadZones: function(a) {
            for (var b = 0; b < this._gamepads.length; b++)
                this._gamepads[b].deadZone = a
        },
        stop: function() {
            this._active = !1,
            window.removeEventListener("gamepadconnected", this._onGamepadConnected),
            window.removeEventListener("gamepaddisconnected", this._onGamepadDisconnected)
        },
        reset: function() {
            this.update();
            for (var a = 0; a < this._gamepads.length; a++)
                this._gamepads[a].reset()
        },
        justPressed: function(a, b) {
            for (var c = 0; c < this._gamepads.length; c++)
                if (this._gamepads[c].justPressed(a, b) === !0)
                    return !0;
            return !1
        },
        justReleased: function(a, b) {
            for (var c = 0; c < this._gamepads.length; c++)
                if (this._gamepads[c].justReleased(a, b) === !0)
                    return !0;
            return !1
        },
        isDown: function(a) {
            for (var b = 0; b < this._gamepads.length; b++)
                if (this._gamepads[b].isDown(a) === !0)
                    return !0;
            return !1
        },
        destroy: function() {
            this.stop();
            for (var a = 0; a < this._gamepads.length; a++)
                this._gamepads[a].destroy()
        }
    },
    c.Gamepad.prototype.constructor = c.Gamepad,
    Object.defineProperty(c.Gamepad.prototype, "active", {
        get: function() {
            return this._active
        }
    }),
    Object.defineProperty(c.Gamepad.prototype, "supported", {
        get: function() {
            return this._gamepadSupportAvailable
        }
    }),
    Object.defineProperty(c.Gamepad.prototype, "padsConnected", {
        get: function() {
            return this._rawPads.length
        }
    }),
    Object.defineProperty(c.Gamepad.prototype, "pad1", {
        get: function() {
            return this._gamepads[0]
        }
    }),
    Object.defineProperty(c.Gamepad.prototype, "pad2", {
        get: function() {
            return this._gamepads[1]
        }
    }),
    Object.defineProperty(c.Gamepad.prototype, "pad3", {
        get: function() {
            return this._gamepads[2]
        }
    }),
    Object.defineProperty(c.Gamepad.prototype, "pad4", {
        get: function() {
            return this._gamepads[3]
        }
    }),
    c.Gamepad.BUTTON_0 = 0,
    c.Gamepad.BUTTON_1 = 1,
    c.Gamepad.BUTTON_2 = 2,
    c.Gamepad.BUTTON_3 = 3,
    c.Gamepad.BUTTON_4 = 4,
    c.Gamepad.BUTTON_5 = 5,
    c.Gamepad.BUTTON_6 = 6,
    c.Gamepad.BUTTON_7 = 7,
    c.Gamepad.BUTTON_8 = 8,
    c.Gamepad.BUTTON_9 = 9,
    c.Gamepad.BUTTON_10 = 10,
    c.Gamepad.BUTTON_11 = 11,
    c.Gamepad.BUTTON_12 = 12,
    c.Gamepad.BUTTON_13 = 13,
    c.Gamepad.BUTTON_14 = 14,
    c.Gamepad.BUTTON_15 = 15,
    c.Gamepad.AXIS_0 = 0,
    c.Gamepad.AXIS_1 = 1,
    c.Gamepad.AXIS_2 = 2,
    c.Gamepad.AXIS_3 = 3,
    c.Gamepad.AXIS_4 = 4,
    c.Gamepad.AXIS_5 = 5,
    c.Gamepad.AXIS_6 = 6,
    c.Gamepad.AXIS_7 = 7,
    c.Gamepad.AXIS_8 = 8,
    c.Gamepad.AXIS_9 = 9,
    c.Gamepad.XBOX360_A = 0,
    c.Gamepad.XBOX360_B = 1,
    c.Gamepad.XBOX360_X = 2,
    c.Gamepad.XBOX360_Y = 3,
    c.Gamepad.XBOX360_LEFT_BUMPER = 4,
    c.Gamepad.XBOX360_RIGHT_BUMPER = 5,
    c.Gamepad.XBOX360_LEFT_TRIGGER = 6,
    c.Gamepad.XBOX360_RIGHT_TRIGGER = 7,
    c.Gamepad.XBOX360_BACK = 8,
    c.Gamepad.XBOX360_START = 9,
    c.Gamepad.XBOX360_STICK_LEFT_BUTTON = 10,
    c.Gamepad.XBOX360_STICK_RIGHT_BUTTON = 11,
    c.Gamepad.XBOX360_DPAD_LEFT = 14,
    c.Gamepad.XBOX360_DPAD_RIGHT = 15,
    c.Gamepad.XBOX360_DPAD_UP = 12,
    c.Gamepad.XBOX360_DPAD_DOWN = 13,
    c.Gamepad.XBOX360_STICK_LEFT_X = 0,
    c.Gamepad.XBOX360_STICK_LEFT_Y = 1,
    c.Gamepad.XBOX360_STICK_RIGHT_X = 2,
    c.Gamepad.XBOX360_STICK_RIGHT_Y = 3,
    c.Gamepad.PS3XC_X = 0,
    c.Gamepad.PS3XC_CIRCLE = 1,
    c.Gamepad.PS3XC_SQUARE = 2,
    c.Gamepad.PS3XC_TRIANGLE = 3,
    c.Gamepad.PS3XC_L1 = 4,
    c.Gamepad.PS3XC_R1 = 5,
    c.Gamepad.PS3XC_L2 = 6,
    c.Gamepad.PS3XC_R2 = 7,
    c.Gamepad.PS3XC_SELECT = 8,
    c.Gamepad.PS3XC_START = 9,
    c.Gamepad.PS3XC_STICK_LEFT_BUTTON = 10,
    c.Gamepad.PS3XC_STICK_RIGHT_BUTTON = 11,
    c.Gamepad.PS3XC_DPAD_UP = 12,
    c.Gamepad.PS3XC_DPAD_DOWN = 13,
    c.Gamepad.PS3XC_DPAD_LEFT = 14,
    c.Gamepad.PS3XC_DPAD_RIGHT = 15,
    c.Gamepad.PS3XC_STICK_LEFT_X = 0,
    c.Gamepad.PS3XC_STICK_LEFT_Y = 1,
    c.Gamepad.PS3XC_STICK_RIGHT_X = 2,
    c.Gamepad.PS3XC_STICK_RIGHT_Y = 3,
    c.SinglePad = function(a, b) {
        this.game = a,
        this.index = null,
        this.connected = !1,
        this.callbackContext = this,
        this.onConnectCallback = null,
        this.onDisconnectCallback = null,
        this.onDownCallback = null,
        this.onUpCallback = null,
        this.onAxisCallback = null,
        this.onFloatCallback = null,
        this.deadZone = .26,
        this._padParent = b,
        this._rawPad = null,
        this._prevTimestamp = null,
        this._buttons = [],
        this._buttonsLen = 0,
        this._axes = [],
        this._axesLen = 0
    }
    ,
    c.SinglePad.prototype = {
        addCallbacks: function(a, b) {
            "undefined" != typeof b && (this.onConnectCallback = "function" == typeof b.onConnect ? b.onConnect : this.onConnectCallback,
            this.onDisconnectCallback = "function" == typeof b.onDisconnect ? b.onDisconnect : this.onDisconnectCallback,
            this.onDownCallback = "function" == typeof b.onDown ? b.onDown : this.onDownCallback,
            this.onUpCallback = "function" == typeof b.onUp ? b.onUp : this.onUpCallback,
            this.onAxisCallback = "function" == typeof b.onAxis ? b.onAxis : this.onAxisCallback,
            this.onFloatCallback = "function" == typeof b.onFloat ? b.onFloat : this.onFloatCallback)
        },
        getButton: function(a) {
            return this._buttons[a] ? this._buttons[a] : null
        },
        pollStatus: function() {
            if (this.connected && this.game.input.enabled && this.game.input.gamepad.enabled && (!this._rawPad.timestamp || this._rawPad.timestamp !== this._prevTimestamp)) {
                for (var a = 0; a < this._buttonsLen; a++) {
                    var b = isNaN(this._rawPad.buttons[a]) ? this._rawPad.buttons[a].value : this._rawPad.buttons[a];
                    b !== this._buttons[a].value && (1 === b ? this.processButtonDown(a, b) : 0 === b ? this.processButtonUp(a, b) : this.processButtonFloat(a, b))
                }
                for (var c = 0; c < this._axesLen; c++) {
                    var d = this._rawPad.axes[c];
                    d > 0 && d > this.deadZone || 0 > d && d < -this.deadZone ? this.processAxisChange(c, d) : this.processAxisChange(c, 0)
                }
                this._prevTimestamp = this._rawPad.timestamp
            }
        },
        connect: function(a) {
            var b = !this.connected;
            this.connected = !0,
            this.index = a.index,
            this._rawPad = a,
            this._buttons = [],
            this._buttonsLen = a.buttons.length,
            this._axes = [],
            this._axesLen = a.axes.length;
            for (var d = 0; d < this._axesLen; d++)
                this._axes[d] = a.axes[d];
            for (var e in a.buttons)
                e = parseInt(e, 10),
                this._buttons[e] = new c.DeviceButton(this,e);
            b && this._padParent.onConnectCallback && this._padParent.onConnectCallback.call(this._padParent.callbackContext, this.index),
            b && this.onConnectCallback && this.onConnectCallback.call(this.callbackContext)
        },
        disconnect: function() {
            var a = this.connected
              , b = this.index;
            this.connected = !1,
            this.index = null,
            this._rawPad = void 0;
            for (var c = 0; c < this._buttonsLen; c++)
                this._buttons[c].destroy();
            this._buttons = [],
            this._buttonsLen = 0,
            this._axes = [],
            this._axesLen = 0,
            a && this._padParent.onDisconnectCallback && this._padParent.onDisconnectCallback.call(this._padParent.callbackContext, b),
            a && this.onDisconnectCallback && this.onDisconnectCallback.call(this.callbackContext)
        },
        destroy: function() {
            this._rawPad = void 0;
            for (var a = 0; a < this._buttonsLen; a++)
                this._buttons[a].destroy();
            this._buttons = [],
            this._buttonsLen = 0,
            this._axes = [],
            this._axesLen = 0,
            this.onConnectCallback = null,
            this.onDisconnectCallback = null,
            this.onDownCallback = null,
            this.onUpCallback = null,
            this.onAxisCallback = null,
            this.onFloatCallback = null
        },
        processAxisChange: function(a, b) {
            this._axes[a] !== b && (this._axes[a] = b,
            this._padParent.onAxisCallback && this._padParent.onAxisCallback.call(this._padParent.callbackContext, this, a, b),
            this.onAxisCallback && this.onAxisCallback.call(this.callbackContext, this, a, b))
        },
        processButtonDown: function(a, b) {
            this._padParent.onDownCallback && this._padParent.onDownCallback.call(this._padParent.callbackContext, a, b, this.index),
            this.onDownCallback && this.onDownCallback.call(this.callbackContext, a, b),
            this._buttons[a] && this._buttons[a].start(null, b)
        },
        processButtonUp: function(a, b) {
            this._padParent.onUpCallback && this._padParent.onUpCallback.call(this._padParent.callbackContext, a, b, this.index),
            this.onUpCallback && this.onUpCallback.call(this.callbackContext, a, b),
            this._buttons[a] && this._buttons[a].stop(null, b)
        },
        processButtonFloat: function(a, b) {
            this._padParent.onFloatCallback && this._padParent.onFloatCallback.call(this._padParent.callbackContext, a, b, this.index),
            this.onFloatCallback && this.onFloatCallback.call(this.callbackContext, a, b),
            this._buttons[a] && this._buttons[a].padFloat(b)
        },
        axis: function(a) {
            return this._axes[a] ? this._axes[a] : !1
        },
        isDown: function(a) {
            return this._buttons[a] ? this._buttons[a].isDown : !1
        },
        isUp: function(a) {
            return this._buttons[a] ? this._buttons[a].isUp : !1
        },
        justReleased: function(a, b) {
            return this._buttons[a] ? this._buttons[a].justReleased(b) : void 0
        },
        justPressed: function(a, b) {
            return this._buttons[a] ? this._buttons[a].justPressed(b) : void 0
        },
        buttonValue: function(a) {
            return this._buttons[a] ? this._buttons[a].value : null
        },
        reset: function() {
            for (var a = 0; a < this._axes.length; a++)
                this._axes[a] = 0
        }
    },
    c.SinglePad.prototype.constructor = c.SinglePad,
    c.Key = function(a, b) {
        this.game = a,
        this._enabled = !0,
        this.event = null,
        this.isDown = !1,
        this.isUp = !0,
        this.altKey = !1,
        this.ctrlKey = !1,
        this.shiftKey = !1,
        this.timeDown = 0,
        this.duration = 0,
        this.timeUp = -2500,
        this.repeats = 0,
        this.keyCode = b,
        this.onDown = new c.Signal,
        this.onHoldCallback = null,
        this.onHoldContext = null,
        this.onUp = new c.Signal,
        this._justDown = !1,
        this._justUp = !1
    }
    ,
    c.Key.prototype = {
        update: function() {
            this._enabled && this.isDown && (this.duration = this.game.time.time - this.timeDown,
            this.repeats++,
            this.onHoldCallback && this.onHoldCallback.call(this.onHoldContext, this))
        },
        processKeyDown: function(a) {
            this._enabled && (this.event = a,
            this.isDown || (this.altKey = a.altKey,
            this.ctrlKey = a.ctrlKey,
            this.shiftKey = a.shiftKey,
            this.isDown = !0,
            this.isUp = !1,
            this.timeDown = this.game.time.time,
            this.duration = 0,
            this.repeats = 0,
            this._justDown = !0,
            this.onDown.dispatch(this)))
        },
        processKeyUp: function(a) {
            this._enabled && (this.event = a,
            this.isUp || (this.isDown = !1,
            this.isUp = !0,
            this.timeUp = this.game.time.time,
            this.duration = this.game.time.time - this.timeDown,
            this._justUp = !0,
            this.onUp.dispatch(this)))
        },
        reset: function(a) {
            void 0 === a && (a = !0),
            this.isDown = !1,
            this.isUp = !0,
            this.timeUp = this.game.time.time,
            this.duration = 0,
            this._enabled = !0,
            this._justDown = !1,
            this._justUp = !1,
            a && (this.onDown.removeAll(),
            this.onUp.removeAll(),
            this.onHoldCallback = null,
            this.onHoldContext = null)
        },
        downDuration: function(a) {
            return void 0 === a && (a = 50),
            this.isDown && this.duration < a
        },
        upDuration: function(a) {
            return void 0 === a && (a = 50),
            !this.isDown && this.game.time.time - this.timeUp < a
        }
    },
    Object.defineProperty(c.Key.prototype, "justDown", {
        get: function() {
            var a = this._justDown;
            return this._justDown = !1,
            a
        }
    }),
    Object.defineProperty(c.Key.prototype, "justUp", {
        get: function() {
            var a = this._justUp;
            return this._justUp = !1,
            a
        }
    }),
    Object.defineProperty(c.Key.prototype, "enabled", {
        get: function() {
            return this._enabled
        },
        set: function(a) {
            a = !!a,
            a !== this._enabled && (a || this.reset(!1),
            this._enabled = a)
        }
    }),
    c.Key.prototype.constructor = c.Key,
    c.Keyboard = function(a) {
        this.game = a,
        this.enabled = !0,
        this.event = null,
        this.pressEvent = null,
        this.callbackContext = this,
        this.onDownCallback = null,
        this.onPressCallback = null,
        this.onUpCallback = null,
        this._keys = [],
        this._capture = [],
        this._onKeyDown = null,
        this._onKeyPress = null,
        this._onKeyUp = null,
        this._i = 0,
        this._k = 0
    }
    ,
    c.Keyboard.prototype = {
        addCallbacks: function(a, b, c, d) {
            this.callbackContext = a,
            "undefined" != typeof b && (this.onDownCallback = b),
            "undefined" != typeof c && (this.onUpCallback = c),
            "undefined" != typeof d && (this.onPressCallback = d)
        },
        addKey: function(a) {
            return this._keys[a] || (this._keys[a] = new c.Key(this.game,a),
            this.addKeyCapture(a)),
            this._keys[a]
        },
        addKeys: function(a) {
            var b = {};
            for (var c in a)
                b[c] = this.addKey(a[c]);
            return b
        },
        removeKey: function(a) {
            this._keys[a] && (this._keys[a] = null,
            this.removeKeyCapture(a))
        },
        createCursorKeys: function() {
            return this.addKeys({
                up: c.Keyboard.UP,
                down: c.Keyboard.DOWN,
                left: c.Keyboard.LEFT,
                right: c.Keyboard.RIGHT
            })
        },
        start: function() {
            if (!this.game.device.cocoonJS && null === this._onKeyDown) {
                var a = this;
                this._onKeyDown = function(b) {
                    return a.processKeyDown(b)
                }
                ,
                this._onKeyUp = function(b) {
                    return a.processKeyUp(b)
                }
                ,
                this._onKeyPress = function(b) {
                    return a.processKeyPress(b)
                }
                ,
                window.addEventListener("keydown", this._onKeyDown, !1),
                window.addEventListener("keyup", this._onKeyUp, !1),
                window.addEventListener("keypress", this._onKeyPress, !1)
            }
        },
        stop: function() {
            window.removeEventListener("keydown", this._onKeyDown),
            window.removeEventListener("keyup", this._onKeyUp),
            window.removeEventListener("keypress", this._onKeyPress),
            this._onKeyDown = null,
            this._onKeyUp = null,
            this._onKeyPress = null
        },
        destroy: function() {
            this.stop(),
            this.clearCaptures(),
            this._keys.length = 0,
            this._i = 0
        },
        addKeyCapture: function(a) {
            if ("object" == typeof a)
                for (var b in a)
                    this._capture[a[b]] = !0;
            else
                this._capture[a] = !0
        },
        removeKeyCapture: function(a) {
            delete this._capture[a]
        },
        clearCaptures: function() {
            this._capture = {}
        },
        update: function() {
            for (this._i = this._keys.length; this._i--; )
                this._keys[this._i] && this._keys[this._i].update()
        },
        processKeyDown: function(a) {
            this.event = a,
            this.game.input.enabled && this.enabled && (this._capture[a.keyCode] && a.preventDefault(),
            this._keys[a.keyCode] || (this._keys[a.keyCode] = new c.Key(this.game,a.keyCode)),
            this._keys[a.keyCode].processKeyDown(a),
            this._k = a.keyCode,
            this.onDownCallback && this.onDownCallback.call(this.callbackContext, a))
        },
        processKeyPress: function(a) {
            this.pressEvent = a,
            this.game.input.enabled && this.enabled && this.onPressCallback && this.onPressCallback.call(this.callbackContext, String.fromCharCode(a.charCode), a)
        },
        processKeyUp: function(a) {
            this.event = a,
            this.game.input.enabled && this.enabled && (this._capture[a.keyCode] && a.preventDefault(),
            this._keys[a.keyCode] || (this._keys[a.keyCode] = new c.Key(this.game,a.keyCode)),
            this._keys[a.keyCode].processKeyUp(a),
            this.onUpCallback && this.onUpCallback.call(this.callbackContext, a))
        },
        reset: function(a) {
            void 0 === a && (a = !0),
            this.event = null;
            for (var b = this._keys.length; b--; )
                this._keys[b] && this._keys[b].reset(a)
        },
        downDuration: function(a, b) {
            return this._keys[a] ? this._keys[a].downDuration(b) : null
        },
        upDuration: function(a, b) {
            return this._keys[a] ? this._keys[a].upDuration(b) : null
        },
        isDown: function(a) {
            return this._keys[a] ? this._keys[a].isDown : null
        }
    },
    Object.defineProperty(c.Keyboard.prototype, "lastChar", {
        get: function() {
            return 32 === this.event.charCode ? "" : String.fromCharCode(this.pressEvent.charCode)
        }
    }),
    Object.defineProperty(c.Keyboard.prototype, "lastKey", {
        get: function() {
            return this._keys[this._k]
        }
    }),
    c.Keyboard.prototype.constructor = c.Keyboard,
    c.Keyboard.A = "A".charCodeAt(0),
    c.Keyboard.B = "B".charCodeAt(0),
    c.Keyboard.C = "C".charCodeAt(0),
    c.Keyboard.D = "D".charCodeAt(0),
    c.Keyboard.E = "E".charCodeAt(0),
    c.Keyboard.F = "F".charCodeAt(0),
    c.Keyboard.G = "G".charCodeAt(0),
    c.Keyboard.H = "H".charCodeAt(0),
    c.Keyboard.I = "I".charCodeAt(0),
    c.Keyboard.J = "J".charCodeAt(0),
    c.Keyboard.K = "K".charCodeAt(0),
    c.Keyboard.L = "L".charCodeAt(0),
    c.Keyboard.M = "M".charCodeAt(0),
    c.Keyboard.N = "N".charCodeAt(0),
    c.Keyboard.O = "O".charCodeAt(0),
    c.Keyboard.P = "P".charCodeAt(0),
    c.Keyboard.Q = "Q".charCodeAt(0),
    c.Keyboard.R = "R".charCodeAt(0),
    c.Keyboard.S = "S".charCodeAt(0),
    c.Keyboard.T = "T".charCodeAt(0),
    c.Keyboard.U = "U".charCodeAt(0),
    c.Keyboard.V = "V".charCodeAt(0),
    c.Keyboard.W = "W".charCodeAt(0),
    c.Keyboard.X = "X".charCodeAt(0),
    c.Keyboard.Y = "Y".charCodeAt(0),
    c.Keyboard.Z = "Z".charCodeAt(0),
    c.Keyboard.ZERO = "0".charCodeAt(0),
    c.Keyboard.ONE = "1".charCodeAt(0),
    c.Keyboard.TWO = "2".charCodeAt(0),
    c.Keyboard.THREE = "3".charCodeAt(0),
    c.Keyboard.FOUR = "4".charCodeAt(0),
    c.Keyboard.FIVE = "5".charCodeAt(0),
    c.Keyboard.SIX = "6".charCodeAt(0),
    c.Keyboard.SEVEN = "7".charCodeAt(0),
    c.Keyboard.EIGHT = "8".charCodeAt(0),
    c.Keyboard.NINE = "9".charCodeAt(0),
    c.Keyboard.NUMPAD_0 = 96,
    c.Keyboard.NUMPAD_1 = 97,
    c.Keyboard.NUMPAD_2 = 98,
    c.Keyboard.NUMPAD_3 = 99,
    c.Keyboard.NUMPAD_4 = 100,
    c.Keyboard.NUMPAD_5 = 101,
    c.Keyboard.NUMPAD_6 = 102,
    c.Keyboard.NUMPAD_7 = 103,
    c.Keyboard.NUMPAD_8 = 104,
    c.Keyboard.NUMPAD_9 = 105,
    c.Keyboard.NUMPAD_MULTIPLY = 106,
    c.Keyboard.NUMPAD_ADD = 107,
    c.Keyboard.NUMPAD_ENTER = 108,
    c.Keyboard.NUMPAD_SUBTRACT = 109,
    c.Keyboard.NUMPAD_DECIMAL = 110,
    c.Keyboard.NUMPAD_DIVIDE = 111,
    c.Keyboard.F1 = 112,
    c.Keyboard.F2 = 113,
    c.Keyboard.F3 = 114,
    c.Keyboard.F4 = 115,
    c.Keyboard.F5 = 116,
    c.Keyboard.F6 = 117,
    c.Keyboard.F7 = 118,
    c.Keyboard.F8 = 119,
    c.Keyboard.F9 = 120,
    c.Keyboard.F10 = 121,
    c.Keyboard.F11 = 122,
    c.Keyboard.F12 = 123,
    c.Keyboard.F13 = 124,
    c.Keyboard.F14 = 125,
    c.Keyboard.F15 = 126,
    c.Keyboard.COLON = 186,
    c.Keyboard.EQUALS = 187,
    c.Keyboard.COMMA = 188,
    c.Keyboard.UNDERSCORE = 189,
    c.Keyboard.PERIOD = 190,
    c.Keyboard.QUESTION_MARK = 191,
    c.Keyboard.TILDE = 192,
    c.Keyboard.OPEN_BRACKET = 219,
    c.Keyboard.BACKWARD_SLASH = 220,
    c.Keyboard.CLOSED_BRACKET = 221,
    c.Keyboard.QUOTES = 222,
    c.Keyboard.BACKSPACE = 8,
    c.Keyboard.TAB = 9,
    c.Keyboard.CLEAR = 12,
    c.Keyboard.ENTER = 13,
    c.Keyboard.SHIFT = 16,
    c.Keyboard.CONTROL = 17,
    c.Keyboard.ALT = 18,
    c.Keyboard.CAPS_LOCK = 20,
    c.Keyboard.ESC = 27,
    c.Keyboard.SPACEBAR = 32,
    c.Keyboard.PAGE_UP = 33,
    c.Keyboard.PAGE_DOWN = 34,
    c.Keyboard.END = 35,
    c.Keyboard.HOME = 36,
    c.Keyboard.LEFT = 37,
    c.Keyboard.UP = 38,
    c.Keyboard.RIGHT = 39,
    c.Keyboard.DOWN = 40,
    c.Keyboard.PLUS = 43,
    c.Keyboard.MINUS = 44,
    c.Keyboard.INSERT = 45,
    c.Keyboard.DELETE = 46,
    c.Keyboard.HELP = 47,
    c.Keyboard.NUM_LOCK = 144,
    c.Component = function() {}
    ,
    c.Component.Angle = function() {}
    ,
    c.Component.Angle.prototype = {
        angle: {
            get: function() {
                return c.Math.wrapAngle(c.Math.radToDeg(this.rotation))
            },
            set: function(a) {
                this.rotation = c.Math.degToRad(c.Math.wrapAngle(a))
            }
        }
    },
    c.Component.Animation = function() {}
    ,
    c.Component.Animation.prototype = {
        play: function(a, b, c, d) {
            return this.animations ? this.animations.play(a, b, c, d) : void 0
        }
    },
    c.Component.AutoCull = function() {}
    ,
    c.Component.AutoCull.prototype = {
        autoCull: !1,
        inCamera: {
            get: function() {
                return this.autoCull || this.checkWorldBounds || (this._bounds.copyFrom(this.getBounds()),
                this._bounds.x += this.game.camera.view.x,
                this._bounds.y += this.game.camera.view.y),
                this.game.world.camera.view.intersects(this._bounds)
            }
        }
    },
    c.Component.Bounds = function() {}
    ,
    c.Component.Bounds.prototype = {
        offsetX: {
            get: function() {
                return this.anchor.x * this.width
            }
        },
        offsetY: {
            get: function() {
                return this.anchor.y * this.height
            }
        },
        left: {
            get: function() {
                return this.x - this.offsetX
            }
        },
        right: {
            get: function() {
                return this.x + this.width - this.offsetX
            }
        },
        top: {
            get: function() {
                return this.y - this.offsetY
            }
        },
        bottom: {
            get: function() {
                return this.y + this.height - this.offsetY
            }
        }
    },
    c.Component.BringToTop = function() {}
    ,
    c.Component.BringToTop.prototype.bringToTop = function() {
        return this.parent && this.parent.bringToTop(this),
        this
    }
    ,
    c.Component.BringToTop.prototype.sendToBack = function() {
        return this.parent && this.parent.sendToBack(this),
        this
    }
    ,
    c.Component.BringToTop.prototype.moveUp = function() {
        return this.parent && this.parent.moveUp(this),
        this
    }
    ,
    c.Component.BringToTop.prototype.moveDown = function() {
        return this.parent && this.parent.moveDown(this),
        this
    }
    ,
    c.Component.Core = function() {}
    ,
    c.Component.Core.install = function(a) {
        c.Utils.mixinPrototype(this, c.Component.Core.prototype),
        this.components = {};
        for (var b = 0; b < a.length; b++) {
            var d = a[b]
              , e = !1;
            "Destroy" === d && (e = !0),
            c.Utils.mixinPrototype(this, c.Component[d].prototype, e),
            this.components[d] = !0
        }
    }
    ,
    c.Component.Core.init = function(a, b, d, e, f) {
        this.game = a,
        this.key = e,
        this.position.set(b, d),
        this.world = new c.Point(b,d),
        this.previousPosition = new c.Point(b,d),
        this.events = new c.Events(this),
        this._bounds = new c.Rectangle,
        this.components.PhysicsBody && (this.body = this.body),
        this.components.Animation && (this.animations = new c.AnimationManager(this)),
        this.components.LoadTexture && null !== e && this.loadTexture(e, f),
        this.components.FixedToCamera && (this.cameraOffset = new c.Point(b,d))
    }
    ,
    c.Component.Core.preUpdate = function() {
        if (this.pendingDestroy)
            return void this.destroy();
        if (this.previousPosition.set(this.world.x, this.world.y),
        this.previousRotation = this.rotation,
        !this.exists || !this.parent.exists)
            return this.renderOrderID = -1,
            !1;
        this.world.setTo(this.game.camera.x + this.worldTransform.tx, this.game.camera.y + this.worldTransform.ty),
        this.visible && (this.renderOrderID = this.game.stage.currentRenderOrderID++),
        this.texture && (this.texture.requiresReTint = !1),
        this.animations && this.animations.update(),
        this.body && this.body.preUpdate();
        for (var a = 0; a < this.children.length; a++)
            this.children[a].preUpdate();
        return !0
    }
    ,
    c.Component.Core.prototype = {
        game: null,
        name: "",
        components: {},
        z: 0,
        events: void 0,
        animations: void 0,
        key: "",
        world: null,
        debug: !1,
        previousPosition: null,
        previousRotation: 0,
        renderOrderID: 0,
        fresh: !0,
        pendingDestroy: !1,
        _bounds: null,
        _exists: !0,
        exists: {
            get: function() {
                return this._exists
            },
            set: function(a) {
                a ? (this._exists = !0,
                this.body && this.body.type === c.Physics.P2JS && this.body.addToWorld(),
                this.visible = !0) : (this._exists = !1,
                this.body && this.body.type === c.Physics.P2JS && this.body.removeFromWorld(),
                this.visible = !1)
            }
        },
        update: function() {},
        postUpdate: function() {
            this.customRender && this.key.render(),
            this.components.PhysicsBody && c.Component.PhysicsBody.postUpdate.call(this),
            this.components.FixedToCamera && c.Component.FixedToCamera.postUpdate.call(this);
            for (var a = 0; a < this.children.length; a++)
                this.children[a].postUpdate()
        }
    },
    c.Component.Crop = function() {}
    ,
    c.Component.Crop.prototype = {
        cropRect: null,
        _crop: null,
        crop: function(a, b) {
            void 0 === b && (b = !1),
            a ? (b && null !== this.cropRect ? this.cropRect.setTo(a.x, a.y, a.width, a.height) : this.cropRect = b && null === this.cropRect ? new c.Rectangle(a.x,a.y,a.width,a.height) : a,
            this.updateCrop()) : (this._crop = null,
            this.cropRect = null,
            this.resetFrame())
        },
        updateCrop: function() {
            if (this.cropRect) {
                this._crop = c.Rectangle.clone(this.cropRect, this._crop),
                this._crop.x += this._frame.x,
                this._crop.y += this._frame.y;
                var a = Math.max(this._frame.x, this._crop.x)
                  , b = Math.max(this._frame.y, this._crop.y)
                  , d = Math.min(this._frame.right, this._crop.right) - a
                  , e = Math.min(this._frame.bottom, this._crop.bottom) - b;
                this.texture.crop.x = a,
                this.texture.crop.y = b,
                this.texture.crop.width = d,
                this.texture.crop.height = e,
                this.texture.frame.width = Math.min(d, this.cropRect.width),
                this.texture.frame.height = Math.min(e, this.cropRect.height),
                this.texture.width = this.texture.frame.width,
                this.texture.height = this.texture.frame.height,
                this.texture._updateUvs()
            }
        }
    },
    c.Component.Delta = function() {}
    ,
    c.Component.Delta.prototype = {
        deltaX: {
            get: function() {
                return this.world.x - this.previousPosition.x
            }
        },
        deltaY: {
            get: function() {
                return this.world.y - this.previousPosition.y
            }
        },
        deltaZ: {
            get: function() {
                return this.rotation - this.previousRotation
            }
        }
    },
    c.Component.Destroy = function() {}
    ,
    c.Component.Destroy.prototype = {
        destroyPhase: !1,
        destroy: function(a) {
            if (null !== this.game && !this.destroyPhase) {
                void 0 === a && (a = !0),
                this.destroyPhase = !0,
                this.events && this.events.onDestroy$dispatch(this),
                this.parent && (this.parent instanceof c.Group ? this.parent.remove(this) : this.parent.removeChild(this)),
                this.input && this.input.destroy(),
                this.animations && this.animations.destroy(),
                this.body && this.body.destroy(),
                this.events && this.events.destroy();
                var b = this.children.length;
                if (a)
                    for (; b--; )
                        this.children[b].destroy(a);
                else
                    for (; b--; )
                        this.removeChild(this.children[b]);
                this._crop && (this._crop = null),
                this._frame && (this._frame = null),
                c.Video && this.key instanceof c.Video && this.key.onChangeSource.remove(this.resizeFrame, this),
                c.BitmapText && this._glyphs && (this._glyphs = []),
                this.alive = !1,
                this.exists = !1,
                this.visible = !1,
                this.filters = null,
                this.mask = null,
                this.game = null,
                this.renderable = !1,
                this.transformCallback = null,
                this.transformCallbackContext = null,
                this.hitArea = null,
                this.parent = null,
                this.stage = null,
                this.worldTransform = null,
                this.filterArea = null,
                this._bounds = null,
                this._currentBounds = null,
                this._mask = null,
                this._destroyCachedSprite(),
                this.destroyPhase = !1,
                this.pendingDestroy = !1
            }
        }
    },
    c.Events = function(a) {
        this.parent = a
    }
    ,
    c.Events.prototype = {
        destroy: function() {
            this._parent = null,
            this._onDestroy && this._onDestroy.dispose(),
            this._onAddedToGroup && this._onAddedToGroup.dispose(),
            this._onRemovedFromGroup && this._onRemovedFromGroup.dispose(),
            this._onRemovedFromWorld && this._onRemovedFromWorld.dispose(),
            this._onKilled && this._onKilled.dispose(),
            this._onRevived && this._onRevived.dispose(),
            this._onEnterBounds && this._onEnterBounds.dispose(),
            this._onOutOfBounds && this._onOutOfBounds.dispose(),
            this._onInputOver && this._onInputOver.dispose(),
            this._onInputOut && this._onInputOut.dispose(),
            this._onInputDown && this._onInputDown.dispose(),
            this._onInputUp && this._onInputUp.dispose(),
            this._onDragStart && this._onDragStart.dispose(),
            this._onDragUpdate && this._onDragUpdate.dispose(),
            this._onDragStop && this._onDragStop.dispose(),
            this._onAnimationStart && this._onAnimationStart.dispose(),
            this._onAnimationComplete && this._onAnimationComplete.dispose(),
            this._onAnimationLoop && this._onAnimationLoop.dispose()
        },
        onAddedToGroup: null,
        onRemovedFromGroup: null,
        onRemovedFromWorld: null,
        onDestroy: null,
        onKilled: null,
        onRevived: null,
        onOutOfBounds: null,
        onEnterBounds: null,
        onInputOver: null,
        onInputOut: null,
        onInputDown: null,
        onInputUp: null,
        onDragStart: null,
        onDragUpdate: null,
        onDragStop: null,
        onAnimationStart: null,
        onAnimationComplete: null,
        onAnimationLoop: null
    },
    c.Events.prototype.constructor = c.Events;
    for (var e in c.Events.prototype)
        c.Events.prototype.hasOwnProperty(e) && 0 === e.indexOf("on") && null === c.Events.prototype[e] && !function(a, b) {
            "use strict";
            Object.defineProperty(c.Events.prototype, a, {
                get: function() {
                    return this[b] || (this[b] = new c.Signal)
                }
            }),
            c.Events.prototype[a + "$dispatch"] = function() {
                return this[b] ? this[b].dispatch.apply(this[b], arguments) : null
            }
        }(e, "_" + e);
    c.Component.FixedToCamera = function() {}
    ,
    c.Component.FixedToCamera.postUpdate = function() {
        this.fixedToCamera && (this.position.x = (this.game.camera.view.x + this.cameraOffset.x) / this.game.camera.scale.x,
        this.position.y = (this.game.camera.view.y + this.cameraOffset.y) / this.game.camera.scale.y)
    }
    ,
    c.Component.FixedToCamera.prototype = {
        _fixedToCamera: !1,
        fixedToCamera: {
            get: function() {
                return this._fixedToCamera
            },
            set: function(a) {
                a ? (this._fixedToCamera = !0,
                this.cameraOffset.set(this.x, this.y)) : this._fixedToCamera = !1
            }
        },
        cameraOffset: new c.Point
    },
    c.Component.Health = function() {}
    ,
    c.Component.Health.prototype = {
        health: 1,
        maxHealth: 100,
        damage: function(a) {
            return this.alive && (this.health -= a,
            this.health <= 0 && this.kill()),
            this
        },
        heal: function(a) {
            return this.alive && (this.health += a,
            this.health > this.maxHealth && (this.health = this.maxHealth)),
            this
        }
    },
    c.Component.InCamera = function() {}
    ,
    c.Component.InCamera.prototype = {
        inCamera: {
            get: function() {
                return this.game.world.camera.view.intersects(this._bounds)
            }
        }
    },
    c.Component.InputEnabled = function() {}
    ,
    c.Component.InputEnabled.prototype = {
        input: null,
        inputEnabled: {
            get: function() {
                return this.input && this.input.enabled
            },
            set: function(a) {
                a ? null === this.input ? (this.input = new c.InputHandler(this),
                this.input.start()) : this.input && !this.input.enabled && this.input.start() : this.input && this.input.enabled && this.input.stop()
            }
        }
    },
    c.Component.InWorld = function() {}
    ,
    c.Component.InWorld.preUpdate = function() {
        if ((this.autoCull || this.checkWorldBounds) && (this._bounds.copyFrom(this.getBounds()),
        this._bounds.x += this.game.camera.view.x,
        this._bounds.y += this.game.camera.view.y,
        this.autoCull && (this.game.world.camera.view.intersects(this._bounds) ? (this.renderable = !0,
        this.game.world.camera.totalInView++) : this.renderable = !1),
        this.checkWorldBounds))
            if (this._outOfBoundsFired && this.game.world.bounds.intersects(this._bounds))
                this._outOfBoundsFired = !1,
                this.events.onEnterBounds$dispatch(this);
            else if (!this._outOfBoundsFired && !this.game.world.bounds.intersects(this._bounds) && (this._outOfBoundsFired = !0,
            this.events.onOutOfBounds$dispatch(this),
            this.outOfBoundsKill))
                return this.kill(),
                !1;
        return !0
    }
    ,
    c.Component.InWorld.prototype = {
        checkWorldBounds: !1,
        outOfBoundsKill: !1,
        _outOfBoundsFired: !1,
        inWorld: {
            get: function() {
                return this.game.world.bounds.intersects(this.getBounds())
            }
        }
    },
    c.Component.LifeSpan = function() {}
    ,
    c.Component.LifeSpan.preUpdate = function() {
        return this.lifespan > 0 && (this.lifespan -= this.game.time.physicsElapsedMS,
        this.lifespan <= 0) ? (this.kill(),
        !1) : !0
    }
    ,
    c.Component.LifeSpan.prototype = {
        alive: !0,
        lifespan: 0,
        revive: function(a) {
            return void 0 === a && (a = 1),
            this.alive = !0,
            this.exists = !0,
            this.visible = !0,
            "number" == typeof this.health && (this.health = a),
            this.events && this.events.onRevived$dispatch(this),
            this
        },
        kill: function() {
            return this.alive = !1,
            this.exists = !1,
            this.visible = !1,
            this.events && this.events.onKilled$dispatch(this),
            this
        }
    },
    c.Component.LoadTexture = function() {}
    ,
    c.Component.LoadTexture.prototype = {
        customRender: !1,
        _frame: null,
        loadTexture: function(a, b, d) {
            b = b || 0,
            (d || void 0 === d) && this.animations && this.animations.stop(),
            this.key = a,
            this.customRender = !1;
            var e = this.game.cache
              , f = !0
              , g = !this.texture.baseTexture.scaleMode;
            if (c.RenderTexture && a instanceof c.RenderTexture)
                this.key = a.key,
                this.setTexture(a);
            else if (c.BitmapData && a instanceof c.BitmapData)
                this.customRender = !0,
                this.setTexture(a.texture),
                e.hasFrameData(a.key, c.Cache.BITMAPDATA) && (f = !this.animations.loadFrameData(e.getFrameData(a.key, c.Cache.BITMAPDATA), b));
            else if (c.Video && a instanceof c.Video) {
                this.customRender = !0;
                var h = a.texture.valid;
                this.setTexture(a.texture),
                this.setFrame(a.texture.frame.clone()),
                a.onChangeSource.add(this.resizeFrame, this),
                this.texture.valid = h
            } else if (a instanceof PIXI.Texture)
                this.setTexture(a);
            else {
                var i = e.getImage(a, !0);
                this.key = i.key,
                this.setTexture(new PIXI.Texture(i.base)),
                f = !this.animations.loadFrameData(i.frameData, b)
            }
            f && (this._frame = c.Rectangle.clone(this.texture.frame)),
            g || (this.texture.baseTexture.scaleMode = 1)
        },
        setFrame: function(a) {
            this._frame = a,
            this.texture.frame.x = a.x,
            this.texture.frame.y = a.y,
            this.texture.frame.width = a.width,
            this.texture.frame.height = a.height,
            this.texture.crop.x = a.x,
            this.texture.crop.y = a.y,
            this.texture.crop.width = a.width,
            this.texture.crop.height = a.height,
            a.trimmed ? (this.texture.trim ? (this.texture.trim.x = a.spriteSourceSizeX,
            this.texture.trim.y = a.spriteSourceSizeY,
            this.texture.trim.width = a.sourceSizeW,
            this.texture.trim.height = a.sourceSizeH) : this.texture.trim = {
                x: a.spriteSourceSizeX,
                y: a.spriteSourceSizeY,
                width: a.sourceSizeW,
                height: a.sourceSizeH
            },
            this.texture.width = a.sourceSizeW,
            this.texture.height = a.sourceSizeH,
            this.texture.frame.width = a.sourceSizeW,
            this.texture.frame.height = a.sourceSizeH) : !a.trimmed && this.texture.trim && (this.texture.trim = null),
            this.cropRect && this.updateCrop(),
            this.texture.requiresReTint = !0,
            this.texture._updateUvs(),
            this.tilingTexture && (this.refreshTexture = !0)
        },
        resizeFrame: function(a, b, c) {
            this.texture.frame.resize(b, c),
            this.texture.setFrame(this.texture.frame)
        },
        resetFrame: function() {
            this._frame && this.setFrame(this._frame)
        },
        frame: {
            get: function() {
                return this.animations.frame
            },
            set: function(a) {
                this.animations.frame = a
            }
        },
        frameName: {
            get: function() {
                return this.animations.frameName
            },
            set: function(a) {
                this.animations.frameName = a
            }
        }
    },
    c.Component.Overlap = function() {}
    ,
    c.Component.Overlap.prototype = {
        overlap: function(a) {
            return c.Rectangle.intersects(this.getBounds(), a.getBounds())
        }
    },
    c.Component.PhysicsBody = function() {}
    ,
    c.Component.PhysicsBody.preUpdate = function() {
        return this.fresh && this.exists ? (this.world.setTo(this.parent.position.x + this.position.x, this.parent.position.y + this.position.y),
        this.worldTransform.tx = this.world.x,
        this.worldTransform.ty = this.world.y,
        this.previousPosition.set(this.world.x, this.world.y),
        this.previousRotation = this.rotation,
        this.body && this.body.preUpdate(),
        this.fresh = !1,
        !1) : (this.previousPosition.set(this.world.x, this.world.y),
        this.previousRotation = this.rotation,
        this._exists && this.parent.exists ? !0 : (this.renderOrderID = -1,
        !1))
    }
    ,
    c.Component.PhysicsBody.postUpdate = function() {
        this.exists && this.body && this.body.postUpdate()
    }
    ,
    c.Component.PhysicsBody.prototype = {
        body: null,
        x: {
            get: function() {
                return this.position.x
            },
            set: function(a) {
                this.position.x = a,
                this.body && !this.body.dirty && (this.body._reset = !0)
            }
        },
        y: {
            get: function() {
                return this.position.y
            },
            set: function(a) {
                this.position.y = a,
                this.body && !this.body.dirty && (this.body._reset = !0)
            }
        }
    },
    c.Component.Reset = function() {}
    ,
    c.Component.Reset.prototype.reset = function(a, b, c) {
        return void 0 === c && (c = 1),
        this.world.set(a, b),
        this.position.set(a, b),
        this.fresh = !0,
        this.exists = !0,
        this.visible = !0,
        this.renderable = !0,
        this.components.InWorld && (this._outOfBoundsFired = !1),
        this.components.LifeSpan && (this.alive = !0,
        this.health = c),
        this.components.PhysicsBody && this.body && this.body.reset(a, b, !1, !1),
        this
    }
    ,
    c.Component.ScaleMinMax = function() {}
    ,
    c.Component.ScaleMinMax.prototype = {
        transformCallback: this.checkTransform,
        transformCallbackContext: this,
        scaleMin: null,
        scaleMax: null,
        checkTransform: function(a) {
            this.scaleMin && (a.a < this.scaleMin.x && (a.a = this.scaleMin.x),
            a.d < this.scaleMin.y && (a.d = this.scaleMin.y)),
            this.scaleMax && (a.a > this.scaleMax.x && (a.a = this.scaleMax.x),
            a.d > this.scaleMax.y && (a.d = this.scaleMax.y))
        },
        setScaleMinMax: function(a, b, d, e) {
            void 0 === b ? b = d = e = a : void 0 === d && (d = e = b,
            b = a),
            null === a ? this.scaleMin = null : this.scaleMin ? this.scaleMin.set(a, b) : this.scaleMin = new c.Point(a,b),
            null === d ? this.scaleMax = null : this.scaleMax ? this.scaleMax.set(d, e) : this.scaleMax = new c.Point(d,e)
        }
    },
    c.Component.Smoothed = function() {}
    ,
    c.Component.Smoothed.prototype = {
        smoothed: {
            get: function() {
                return !this.texture.baseTexture.scaleMode
            },
            set: function(a) {
                a ? this.texture && (this.texture.baseTexture.scaleMode = 0) : this.texture && (this.texture.baseTexture.scaleMode = 1)
            }
        }
    },
    c.GameObjectFactory = function(a) {
        this.game = a,
        this.world = this.game.world
    }
    ,
    c.GameObjectFactory.prototype = {
        existing: function(a) {
            return this.world.add(a)
        },
        image: function(a, b, d, e, f) {
            return void 0 === f && (f = this.world),
            f.add(new c.Image(this.game,a,b,d,e))
        },
        sprite: function(a, b, c, d, e) {
            return void 0 === e && (e = this.world),
            e.create(a, b, c, d)
        },
        creature: function(a, b, d, e, f) {
            void 0 === f && (f = this.world);
            var g = new c.Creature(this.game,a,b,d,e);
            return f.add(g),
            g
        },
        tween: function(a) {
            return this.game.tweens.create(a)
        },
        group: function(a, b, d, e, f) {
            return new c.Group(this.game,a,b,d,e,f)
        },
        physicsGroup: function(a, b, d, e) {
            return new c.Group(this.game,b,d,e,!0,a)
        },
        spriteBatch: function(a, b, d) {
            return void 0 === a && (a = null),
            void 0 === b && (b = "group"),
            void 0 === d && (d = !1),
            new c.SpriteBatch(this.game,a,b,d)
        },
        audio: function(a, b, c, d) {
            return this.game.sound.add(a, b, c, d)
        },
        sound: function(a, b, c, d) {
            return this.game.sound.add(a, b, c, d)
        },
        audioSprite: function(a) {
            return this.game.sound.addSprite(a)
        },
        tileSprite: function(a, b, d, e, f, g, h) {
            return void 0 === h && (h = this.world),
            h.add(new c.TileSprite(this.game,a,b,d,e,f,g))
        },
        rope: function(a, b, d, e, f, g) {
            return void 0 === g && (g = this.world),
            g.add(new c.Rope(this.game,a,b,d,e,f))
        },
        text: function(a, b, d, e, f) {
            return void 0 === f && (f = this.world),
            f.add(new c.Text(this.game,a,b,d,e))
        },
        button: function(a, b, d, e, f, g, h, i, j, k) {
            return void 0 === k && (k = this.world),
            k.add(new c.Button(this.game,a,b,d,e,f,g,h,i,j))
        },
        graphics: function(a, b, d) {
            return void 0 === d && (d = this.world),
            d.add(new c.Graphics(this.game,a,b))
        },
        emitter: function(a, b, d) {
            return this.game.particles.add(new c.Particles.Arcade.Emitter(this.game,a,b,d))
        },
        retroFont: function(a, b, d, e, f, g, h, i, j) {
            return new c.RetroFont(this.game,a,b,d,e,f,g,h,i,j)
        },
        bitmapText: function(a, b, d, e, f, g) {
            return void 0 === g && (g = this.world),
            g.add(new c.BitmapText(this.game,a,b,d,e,f))
        },
        tilemap: function(a, b, d, e, f) {
            return new c.Tilemap(this.game,a,b,d,e,f)
        },
        renderTexture: function(a, b, d, e) {
            (void 0 === d || "" === d) && (d = this.game.rnd.uuid()),
            void 0 === e && (e = !1);
            var f = new c.RenderTexture(this.game,a,b,d);
            return e && this.game.cache.addRenderTexture(d, f),
            f
        },
        video: function(a, b) {
            return new c.Video(this.game,a,b)
        },
        bitmapData: function(a, b, d, e) {
            void 0 === e && (e = !1),
            (void 0 === d || "" === d) && (d = this.game.rnd.uuid());
            var f = new c.BitmapData(this.game,d,a,b);
            return e && this.game.cache.addBitmapData(d, f),
            f
        },
        filter: function(a) {
            var b = Array.prototype.splice.call(arguments, 1)
              , a = new c.Filter[a](this.game);
            return a.init.apply(a, b),
            a
        },
        plugin: function(a) {
            return this.game.plugins.add(a)
        }
    },
    c.GameObjectFactory.prototype.constructor = c.GameObjectFactory,
    c.GameObjectCreator = function(a) {
        this.game = a,
        this.world = this.game.world
    }
    ,
    c.GameObjectCreator.prototype = {
        image: function(a, b, d, e) {
            return new c.Image(this.game,a,b,d,e)
        },
        sprite: function(a, b, d, e) {
            return new c.Sprite(this.game,a,b,d,e)
        },
        tween: function(a) {
            return new c.Tween(a,this.game,this.game.tweens)
        },
        group: function(a, b, d, e, f) {
            return new c.Group(this.game,a,b,d,e,f)
        },
        spriteBatch: function(a, b, d) {
            return void 0 === b && (b = "group"),
            void 0 === d && (d = !1),
            new c.SpriteBatch(this.game,a,b,d)
        },
        audio: function(a, b, c, d) {
            return this.game.sound.add(a, b, c, d)
        },
        audioSprite: function(a) {
            return this.game.sound.addSprite(a)
        },
        sound: function(a, b, c, d) {
            return this.game.sound.add(a, b, c, d)
        },
        tileSprite: function(a, b, d, e, f, g) {
            return new c.TileSprite(this.game,a,b,d,e,f,g)
        },
        rope: function(a, b, d, e, f) {
            return new c.Rope(this.game,a,b,d,e,f)
        },
        text: function(a, b, d, e) {
            return new c.Text(this.game,a,b,d,e)
        },
        button: function(a, b, d, e, f, g, h, i, j) {
            return new c.Button(this.game,a,b,d,e,f,g,h,i,j)
        },
        graphics: function(a, b) {
            return new c.Graphics(this.game,a,b)
        },
        emitter: function(a, b, d) {
            return new c.Particles.Arcade.Emitter(this.game,a,b,d)
        },
        retroFont: function(a, b, d, e, f, g, h, i, j) {
            return new c.RetroFont(this.game,a,b,d,e,f,g,h,i,j)
        },
        bitmapText: function(a, b, d, e, f, g) {
            return new c.BitmapText(this.game,a,b,d,e,f,g)
        },
        tilemap: function(a, b, d, e, f) {
            return new c.Tilemap(this.game,a,b,d,e,f)
        },
        renderTexture: function(a, b, d, e) {
            (void 0 === d || "" === d) && (d = this.game.rnd.uuid()),
            void 0 === e && (e = !1);
            var f = new c.RenderTexture(this.game,a,b,d);
            return e && this.game.cache.addRenderTexture(d, f),
            f
        },
        bitmapData: function(a, b, d, e) {
            void 0 === e && (e = !1),
            (void 0 === d || "" === d) && (d = this.game.rnd.uuid());
            var f = new c.BitmapData(this.game,d,a,b);
            return e && this.game.cache.addBitmapData(d, f),
            f
        },
        filter: function(a) {
            var b = Array.prototype.splice.call(arguments, 1)
              , a = new c.Filter[a](this.game);
            return a.init.apply(a, b),
            a
        }
    },
    c.GameObjectCreator.prototype.constructor = c.GameObjectCreator,
    c.Sprite = function(a, b, d, e, f) {
        b = b || 0,
        d = d || 0,
        e = e || null,
        f = f || null,
        this.type = c.SPRITE,
        this.physicsType = c.SPRITE,
        PIXI.Sprite.call(this, PIXI.TextureCache.__default),
        c.Component.Core.init.call(this, a, b, d, e, f)
    }
    ,
    c.Sprite.prototype = Object.create(PIXI.Sprite.prototype),
    c.Sprite.prototype.constructor = c.Sprite,
    c.Component.Core.install.call(c.Sprite.prototype, ["Angle", "Animation", "AutoCull", "Bounds", "BringToTop", "Crop", "Delta", "Destroy", "FixedToCamera", "Health", "InCamera", "InputEnabled", "InWorld", "LifeSpan", "LoadTexture", "Overlap", "PhysicsBody", "Reset", "ScaleMinMax", "Smoothed"]),
    c.Sprite.prototype.preUpdatePhysics = c.Component.PhysicsBody.preUpdate,
    c.Sprite.prototype.preUpdateLifeSpan = c.Component.LifeSpan.preUpdate,
    c.Sprite.prototype.preUpdateInWorld = c.Component.InWorld.preUpdate,
    c.Sprite.prototype.preUpdateCore = c.Component.Core.preUpdate,
    c.Sprite.prototype.preUpdate = function() {
        return this.preUpdatePhysics() && this.preUpdateLifeSpan() && this.preUpdateInWorld() ? this.preUpdateCore() : !1
    }
    ,
    c.Image = function(a, b, d, e, f) {
        b = b || 0,
        d = d || 0,
        e = e || null,
        f = f || null,
        this.type = c.IMAGE,
        PIXI.Sprite.call(this, PIXI.TextureCache.__default),
        c.Component.Core.init.call(this, a, b, d, e, f)
    }
    ,
    c.Image.prototype = Object.create(PIXI.Sprite.prototype),
    c.Image.prototype.constructor = c.Image,
    c.Component.Core.install.call(c.Image.prototype, ["Angle", "Animation", "AutoCull", "Bounds", "BringToTop", "Crop", "Destroy", "FixedToCamera", "InputEnabled", "LifeSpan", "LoadTexture", "Overlap", "Reset", "Smoothed"]),
    c.Image.prototype.preUpdateInWorld = c.Component.InWorld.preUpdate,
    c.Image.prototype.preUpdateCore = c.Component.Core.preUpdate,
    c.Image.prototype.preUpdate = function() {
        return this.preUpdateInWorld() ? this.preUpdateCore() : !1
    }
    ,
    c.TileSprite = function(a, b, d, e, f, g, h) {
        b = b || 0,
        d = d || 0,
        e = e || 256,
        f = f || 256,
        g = g || null,
        h = h || null,
        this.type = c.TILESPRITE,
        this.physicsType = c.SPRITE,
        this._scroll = new c.Point;
        var i = a.cache.getImage("__default", !0);
        PIXI.TilingSprite.call(this, new PIXI.Texture(i.base), e, f),
        c.Component.Core.init.call(this, a, b, d, g, h)
    }
    ,
    c.TileSprite.prototype = Object.create(PIXI.TilingSprite.prototype),
    c.TileSprite.prototype.constructor = c.TileSprite,
    c.Component.Core.install.call(c.TileSprite.prototype, ["Angle", "Animation", "AutoCull", "Bounds", "BringToTop", "Destroy", "FixedToCamera", "Health", "InCamera", "InputEnabled", "InWorld", "LifeSpan", "LoadTexture", "Overlap", "PhysicsBody", "Reset", "Smoothed"]),
    c.TileSprite.prototype.preUpdatePhysics = c.Component.PhysicsBody.preUpdate,
    c.TileSprite.prototype.preUpdateLifeSpan = c.Component.LifeSpan.preUpdate,
    c.TileSprite.prototype.preUpdateInWorld = c.Component.InWorld.preUpdate,
    c.TileSprite.prototype.preUpdateCore = c.Component.Core.preUpdate,
    c.TileSprite.prototype.preUpdate = function() {
        return 0 !== this._scroll.x && (this.tilePosition.x += this._scroll.x * this.game.time.physicsElapsed),
        0 !== this._scroll.y && (this.tilePosition.y += this._scroll.y * this.game.time.physicsElapsed),
        this.preUpdatePhysics() && this.preUpdateLifeSpan() && this.preUpdateInWorld() ? this.preUpdateCore() : !1
    }
    ,
    c.TileSprite.prototype.autoScroll = function(a, b) {
        this._scroll.set(a, b)
    }
    ,
    c.TileSprite.prototype.stopScroll = function() {
        this._scroll.set(0, 0)
    }
    ,
    c.TileSprite.prototype.destroy = function(a) {
        c.Component.Destroy.prototype.destroy.call(this, a),
        PIXI.TilingSprite.prototype.destroy.call(this)
    }
    ,
    c.TileSprite.prototype.reset = function(a, b) {
        return c.Component.Reset.prototype.reset.call(this, a, b),
        this.tilePosition.x = 0,
        this.tilePosition.y = 0,
        this
    }
    ,
    c.Rope = function(a, b, d, e, f, g) {
        this.points = [],
        this.points = g,
        this._hasUpdateAnimation = !1,
        this._updateAnimationCallback = null,
        b = b || 0,
        d = d || 0,
        e = e || null,
        f = f || null,
        this.type = c.ROPE,
        this._scroll = new c.Point,
        PIXI.Rope.call(this, PIXI.TextureCache.__default, this.points),
        c.Component.Core.init.call(this, a, b, d, e, f)
    }
    ,
    c.Rope.prototype = Object.create(PIXI.Rope.prototype),
    c.Rope.prototype.constructor = c.Rope,
    c.Component.Core.install.call(c.Rope.prototype, ["Angle", "Animation", "AutoCull", "Bounds", "BringToTop", "Crop", "Delta", "Destroy", "FixedToCamera", "InputEnabled", "InWorld", "LifeSpan", "LoadTexture", "Overlap", "PhysicsBody", "Reset", "ScaleMinMax", "Smoothed"]),
    c.Rope.prototype.preUpdatePhysics = c.Component.PhysicsBody.preUpdate,
    c.Rope.prototype.preUpdateLifeSpan = c.Component.LifeSpan.preUpdate,
    c.Rope.prototype.preUpdateInWorld = c.Component.InWorld.preUpdate,
    c.Rope.prototype.preUpdateCore = c.Component.Core.preUpdate,
    c.Rope.prototype.preUpdate = function() {
        return 0 !== this._scroll.x && (this.tilePosition.x += this._scroll.x * this.game.time.physicsElapsed),
        0 !== this._scroll.y && (this.tilePosition.y += this._scroll.y * this.game.time.physicsElapsed),
        this.preUpdatePhysics() && this.preUpdateLifeSpan() && this.preUpdateInWorld() ? this.preUpdateCore() : !1
    }
    ,
    c.Rope.prototype.update = function() {
        this._hasUpdateAnimation && this.updateAnimation.call(this)
    }
    ,
    c.Rope.prototype.reset = function(a, b) {
        return c.Component.Reset.prototype.reset.call(this, a, b),
        this.tilePosition.x = 0,
        this.tilePosition.y = 0,
        this
    }
    ,
    Object.defineProperty(c.Rope.prototype, "updateAnimation", {
        get: function() {
            return this._updateAnimation
        },
        set: function(a) {
            a && "function" == typeof a ? (this._hasUpdateAnimation = !0,
            this._updateAnimation = a) : (this._hasUpdateAnimation = !1,
            this._updateAnimation = null)
        }
    }),
    Object.defineProperty(c.Rope.prototype, "segments", {
        get: function() {
            for (var a, b, d, e, f, g, h, i, j = [], k = 0; k < this.points.length; k++)
                a = 4 * k,
                b = this.vertices[a] * this.scale.x,
                d = this.vertices[a + 1] * this.scale.y,
                e = this.vertices[a + 4] * this.scale.x,
                f = this.vertices[a + 3] * this.scale.y,
                g = c.Math.difference(b, e),
                h = c.Math.difference(d, f),
                b += this.world.x,
                d += this.world.y,
                i = new c.Rectangle(b,d,g,h),
                j.push(i);
            return j
        }
    }),
    c.Button = function(a, b, d, e, f, g, h, i, j, k) {
        b = b || 0,
        d = d || 0,
        e = e || null,
        f = f || null,
        g = g || this,
        c.Image.call(this, a, b, d, e, i),
        this.type = c.BUTTON,
        this.physicsType = c.SPRITE,
        this._onOverFrame = null,
        this._onOutFrame = null,
        this._onDownFrame = null,
        this._onUpFrame = null,
        this.onOverSound = null,
        this.onOutSound = null,
        this.onDownSound = null,
        this.onUpSound = null,
        this.onOverSoundMarker = "",
        this.onOutSoundMarker = "",
        this.onDownSoundMarker = "",
        this.onUpSoundMarker = "",
        this.onInputOver = new c.Signal,
        this.onInputOut = new c.Signal,
        this.onInputDown = new c.Signal,
        this.onInputUp = new c.Signal,
        this.onOverMouseOnly = !1,
        this.freezeFrames = !1,
        this.forceOut = !1,
        this.inputEnabled = !0,
        this.input.start(0, !0),
        this.input.useHandCursor = !0,
        this.setFrames(h, i, j, k),
        null !== f && this.onInputUp.add(f, g),
        this.events.onInputOver.add(this.onInputOverHandler, this),
        this.events.onInputOut.add(this.onInputOutHandler, this),
        this.events.onInputDown.add(this.onInputDownHandler, this),
        this.events.onInputUp.add(this.onInputUpHandler, this),
        this.events.onRemovedFromWorld.add(this.removedFromWorld, this)
    }
    ,
    c.Button.prototype = Object.create(c.Image.prototype),
    c.Button.prototype.constructor = c.Button;
    var f = "Over"
      , g = "Out"
      , h = "Down"
      , i = "Up";
    c.Button.prototype.clearFrames = function() {
        this.setFrames(null, null, null, null)
    }
    ,
    c.Button.prototype.removedFromWorld = function() {
        this.inputEnabled = !1
    }
    ,
    c.Button.prototype.setStateFrame = function(a, b, c) {
        var d = "_on" + a + "Frame";
        null !== b ? (this[d] = b,
        c && this.changeStateFrame(a)) : this[d] = null
    }
    ,
    c.Button.prototype.changeStateFrame = function(a) {
        if (this.freezeFrames)
            return !1;
        var b = "_on" + a + "Frame"
          , c = this[b];
        return "string" == typeof c ? (this.frameName = c,
        !0) : "number" == typeof c ? (this.frame = c,
        !0) : !1
    }
    ,
    c.Button.prototype.setFrames = function(a, b, c, d) {
        this.setStateFrame(f, a, this.input.pointerOver()),
        this.setStateFrame(g, b, !this.input.pointerOver()),
        this.setStateFrame(h, c, this.input.pointerDown()),
        this.setStateFrame(i, d, this.input.pointerUp())
    }
    ,
    c.Button.prototype.setStateSound = function(a, b, d) {
        var e = "on" + a + "Sound"
          , f = "on" + a + "SoundMarker";
        b instanceof c.Sound || b instanceof c.AudioSprite ? (this[e] = b,
        this[f] = "string" == typeof d ? d : "") : (this[e] = null,
        this[f] = "")
    }
    ,
    c.Button.prototype.playStateSound = function(a) {
        var b = "on" + a + "Sound"
          , c = this[b];
        if (c) {
            var d = "on" + a + "SoundMarker"
              , e = this[d];
            return c.play(e),
            !0
        }
        return !1
    }
    ,
    c.Button.prototype.setSounds = function(a, b, c, d, e, j, k, l) {
        this.setStateSound(f, a, b),
        this.setStateSound(g, e, j),
        this.setStateSound(h, c, d),
        this.setStateSound(i, k, l)
    }
    ,
    c.Button.prototype.setOverSound = function(a, b) {
        this.setStateSound(f, a, b)
    }
    ,
    c.Button.prototype.setOutSound = function(a, b) {
        this.setStateSound(g, a, b)
    }
    ,
    c.Button.prototype.setDownSound = function(a, b) {
        this.setStateSound(h, a, b)
    }
    ,
    c.Button.prototype.setUpSound = function(a, b) {
        this.setStateSound(i, a, b)
    }
    ,
    c.Button.prototype.onInputOverHandler = function(a, b) {
        b.justReleased() || (this.changeStateFrame(f),
        (!this.onOverMouseOnly || b.isMouse) && (this.playStateSound(f),
        this.onInputOver && this.onInputOver.dispatch(this, b)))
    }
    ,
    c.Button.prototype.onInputOutHandler = function(a, b) {
        this.changeStateFrame(g),
        this.playStateSound(g),
        this.onInputOut && this.onInputOut.dispatch(this, b)
    }
    ,
    c.Button.prototype.onInputDownHandler = function(a, b) {
        this.changeStateFrame(h),
        this.playStateSound(h),
        this.onInputDown && this.onInputDown.dispatch(this, b)
    }
    ,
    c.Button.prototype.onInputUpHandler = function(a, b, c) {
        if (this.playStateSound(i),
        this.onInputUp && this.onInputUp.dispatch(this, b, c),
        !this.freezeFrames)
            if (this.forceOut)
                this.changeStateFrame(g);
            else {
                var d = this.changeStateFrame(i);
                d || this.changeStateFrame(c ? f : g)
            }
    }
    ,
    c.SpriteBatch = function(a, b, d, e) {
        (void 0 === b || null === b) && (b = a.world),
        PIXI.SpriteBatch.call(this),
        c.Group.call(this, a, b, d, e),
        this.type = c.SPRITEBATCH
    }
    ,
    c.SpriteBatch.prototype = c.Utils.extend(!0, c.SpriteBatch.prototype, c.Group.prototype, PIXI.SpriteBatch.prototype),
    c.SpriteBatch.prototype.constructor = c.SpriteBatch,
    c.Particle = function(a, b, d, e, f) {
        c.Sprite.call(this, a, b, d, e, f),
        this.autoScale = !1,
        this.scaleData = null,
        this._s = 0,
        this.autoAlpha = !1,
        this.alphaData = null,
        this._a = 0
    }
    ,
    c.Particle.prototype = Object.create(c.Sprite.prototype),
    c.Particle.prototype.constructor = c.Particle,
    c.Particle.prototype.update = function() {
        this.autoScale && (this._s--,
        this._s ? this.scale.set(this.scaleData[this._s].x, this.scaleData[this._s].y) : this.autoScale = !1),
        this.autoAlpha && (this._a--,
        this._a ? this.alpha = this.alphaData[this._a].v : this.autoAlpha = !1)
    }
    ,
    c.Particle.prototype.onEmit = function() {}
    ,
    c.Particle.prototype.setAlphaData = function(a) {
        this.alphaData = a,
        this._a = a.length - 1,
        this.alpha = this.alphaData[this._a].v,
        this.autoAlpha = !0
    }
    ,
    c.Particle.prototype.setScaleData = function(a) {
        this.scaleData = a,
        this._s = a.length - 1,
        this.scale.set(this.scaleData[this._s].x, this.scaleData[this._s].y),
        this.autoScale = !0
    }
    ,
    c.Particle.prototype.reset = function(a, b, d) {
        return c.Component.Reset.prototype.reset.call(this, a, b, d),
        this.alpha = 1,
        this.scale.set(1),
        this.autoScale = !1,
        this.autoAlpha = !1,
        this
    }
    ,
    c.BitmapData = function(a, b, d, e) {
        (void 0 === d || 0 === d) && (d = 256),
        (void 0 === e || 0 === e) && (e = 256),
        this.game = a,
        this.key = b,
        this.width = d,
        this.height = e,
        this.canvas = PIXI.CanvasPool.create(this, d, e),
        this.context = this.canvas.getContext("2d", {
            alpha: !0
        }),
        this.ctx = this.context,
        this.imageData = this.context.getImageData(0, 0, d, e),
        this.data = null,
        this.imageData && (this.data = this.imageData.data),
        this.pixels = null,
        this.data && (this.imageData.data.buffer ? (this.buffer = this.imageData.data.buffer,
        this.pixels = new Uint32Array(this.buffer)) : window.ArrayBuffer ? (this.buffer = new ArrayBuffer(this.imageData.data.length),
        this.pixels = new Uint32Array(this.buffer)) : this.pixels = this.imageData.data),
        this.baseTexture = new PIXI.BaseTexture(this.canvas),
        this.texture = new PIXI.Texture(this.baseTexture),
        this.textureFrame = new c.Frame(0,0,0,d,e,"bitmapData"),
        this.texture.frame = this.textureFrame,
        this.type = c.BITMAPDATA,
        this.disableTextureUpload = !1,
        this.dirty = !1,
        this.cls = this.clear,
        this._image = null,
        this._pos = new c.Point,
        this._size = new c.Point,
        this._scale = new c.Point,
        this._rotate = 0,
        this._alpha = {
            prev: 1,
            current: 1
        },
        this._anchor = new c.Point,
        this._tempR = 0,
        this._tempG = 0,
        this._tempB = 0,
        this._circle = new c.Circle,
        this._swapCanvas = PIXI.CanvasPool.create(this, d, e)
    }
    ,
    c.BitmapData.prototype = {
        move: function(a, b) {
            return 0 !== a && this.moveH(a),
            0 !== b && this.moveV(b),
            this
        },
        moveH: function(a) {
            var b = this._swapCanvas
              , c = b.getContext("2d")
              , d = this.height
              , e = this.canvas;
            if (c.clearRect(0, 0, this.width, this.height),
            0 > a) {
                a = Math.abs(a);
                var f = this.width - a;
                c.drawImage(e, 0, 0, a, d, f, 0, a, d),
                c.drawImage(e, a, 0, f, d, 0, 0, f, d)
            } else {
                var f = this.width - a;
                c.drawImage(e, f, 0, a, d, 0, 0, a, d),
                c.drawImage(e, 0, 0, f, d, a, 0, f, d)
            }
            return this.clear(),
            this.copy(this._swapCanvas)
        },
        moveV: function(a) {
            var b = this._swapCanvas
              , c = b.getContext("2d")
              , d = this.width
              , e = this.canvas;
            if (c.clearRect(0, 0, this.width, this.height),
            0 > a) {
                a = Math.abs(a);
                var f = this.height - a;
                c.drawImage(e, 0, 0, d, a, 0, f, d, a),
                c.drawImage(e, 0, a, d, f, 0, 0, d, f)
            } else {
                var f = this.height - a;
                c.drawImage(e, 0, f, d, a, 0, 0, d, a),
                c.drawImage(e, 0, 0, d, f, 0, a, d, f)
            }
            return this.clear(),
            this.copy(this._swapCanvas)
        },
        add: function(a) {
            if (Array.isArray(a))
                for (var b = 0; b < a.length; b++)
                    a[b].loadTexture && a[b].loadTexture(this);
            else
                a.loadTexture(this);
            return this
        },
        load: function(a) {
            return "string" == typeof a && (a = this.game.cache.getImage(a)),
            a ? (this.resize(a.width, a.height),
            this.cls(),
            this.draw(a),
            this.update(),
            this) : void 0
        },
        clear: function(a, b, c, d) {
            return void 0 === a && (a = 0),
            void 0 === b && (b = 0),
            void 0 === c && (c = this.width),
            void 0 === d && (d = this.height),
            this.context.clearRect(a, b, c, d),
            this.dirty = !0,
            this
        },
        fill: function(a, b, c, d) {
            return void 0 === d && (d = 1),
            this.context.fillStyle = "rgba(" + a + "," + b + "," + c + "," + d + ")",
            this.context.fillRect(0, 0, this.width, this.height),
            this.dirty = !0,
            this
        },
        generateTexture: function(a) {
            var b = new Image;
            b.src = this.canvas.toDataURL("image/png");
            var c = this.game.cache.addImage(a, "", b);
            return new PIXI.Texture(c.base)
        },
        resize: function(a, b) {
            return (a !== this.width || b !== this.height) && (this.width = a,
            this.height = b,
            this.canvas.width = a,
            this.canvas.height = b,
            this._swapCanvas.width = a,
            this._swapCanvas.height = b,
            this.baseTexture.width = a,
            this.baseTexture.height = b,
            this.textureFrame.width = a,
            this.textureFrame.height = b,
            this.texture.width = a,
            this.texture.height = b,
            this.texture.crop.width = a,
            this.texture.crop.height = b,
            this.update(),
            this.dirty = !0),
            this
        },
        update: function(a, b, c, d) {
            return void 0 === a && (a = 0),
            void 0 === b && (b = 0),
            void 0 === c && (c = Math.max(1, this.width)),
            void 0 === d && (d = Math.max(1, this.height)),
            this.imageData = this.context.getImageData(a, b, c, d),
            this.data = this.imageData.data,
            this.imageData.data.buffer ? (this.buffer = this.imageData.data.buffer,
            this.pixels = new Uint32Array(this.buffer)) : window.ArrayBuffer ? (this.buffer = new ArrayBuffer(this.imageData.data.length),
            this.pixels = new Uint32Array(this.buffer)) : this.pixels = this.imageData.data,
            this
        },
        processPixelRGB: function(a, b, d, e, f, g) {
            void 0 === d && (d = 0),
            void 0 === e && (e = 0),
            void 0 === f && (f = this.width),
            void 0 === g && (g = this.height);
            for (var h = d + f, i = e + g, j = c.Color.createColor(), k = {
                r: 0,
                g: 0,
                b: 0,
                a: 0
            }, l = !1, m = e; i > m; m++)
                for (var n = d; h > n; n++)
                    c.Color.unpackPixel(this.getPixel32(n, m), j),
                    k = a.call(b, j, n, m),
                    k !== !1 && null !== k && void 0 !== k && (this.setPixel32(n, m, k.r, k.g, k.b, k.a, !1),
                    l = !0);
            return l && (this.context.putImageData(this.imageData, 0, 0),
            this.dirty = !0),
            this
        },
        processPixel: function(a, b, c, d, e, f) {
            void 0 === c && (c = 0),
            void 0 === d && (d = 0),
            void 0 === e && (e = this.width),
            void 0 === f && (f = this.height);
            for (var g = c + e, h = d + f, i = 0, j = 0, k = !1, l = d; h > l; l++)
                for (var m = c; g > m; m++)
                    i = this.getPixel32(m, l),
                    j = a.call(b, i, m, l),
                    j !== i && (this.pixels[l * this.width + m] = j,
                    k = !0);
            return k && (this.context.putImageData(this.imageData, 0, 0),
            this.dirty = !0),
            this
        },
        replaceRGB: function(a, b, d, e, f, g, h, i, j) {
            var k = 0
              , l = 0
              , m = this.width
              , n = this.height
              , o = c.Color.packPixel(a, b, d, e);
            void 0 !== j && j instanceof c.Rectangle && (k = j.x,
            l = j.y,
            m = j.width,
            n = j.height);
            for (var p = 0; n > p; p++)
                for (var q = 0; m > q; q++)
                    this.getPixel32(k + q, l + p) === o && this.setPixel32(k + q, l + p, f, g, h, i, !1);
            return this.context.putImageData(this.imageData, 0, 0),
            this.dirty = !0,
            this
        },
        setHSL: function(a, b, d, e) {
            if ((void 0 === a || null === a) && (a = !1),
            (void 0 === b || null === b) && (b = !1),
            (void 0 === d || null === d) && (d = !1),
            a || b || d) {
                void 0 === e && (e = new c.Rectangle(0,0,this.width,this.height));
                for (var f = c.Color.createColor(), g = e.y; g < e.bottom; g++)
                    for (var h = e.x; h < e.right; h++)
                        c.Color.unpackPixel(this.getPixel32(h, g), f, !0),
                        a && (f.h = a),
                        b && (f.s = b),
                        d && (f.l = d),
                        c.Color.HSLtoRGB(f.h, f.s, f.l, f),
                        this.setPixel32(h, g, f.r, f.g, f.b, f.a, !1);
                return this.context.putImageData(this.imageData, 0, 0),
                this.dirty = !0,
                this
            }
        },
        shiftHSL: function(a, b, d, e) {
            if ((void 0 === a || null === a) && (a = !1),
            (void 0 === b || null === b) && (b = !1),
            (void 0 === d || null === d) && (d = !1),
            a || b || d) {
                void 0 === e && (e = new c.Rectangle(0,0,this.width,this.height));
                for (var f = c.Color.createColor(), g = e.y; g < e.bottom; g++)
                    for (var h = e.x; h < e.right; h++)
                        c.Color.unpackPixel(this.getPixel32(h, g), f, !0),
                        a && (f.h = this.game.math.wrap(f.h + a, 0, 1)),
                        b && (f.s = this.game.math.limitValue(f.s + b, 0, 1)),
                        d && (f.l = this.game.math.limitValue(f.l + d, 0, 1)),
                        c.Color.HSLtoRGB(f.h, f.s, f.l, f),
                        this.setPixel32(h, g, f.r, f.g, f.b, f.a, !1);
                return this.context.putImageData(this.imageData, 0, 0),
                this.dirty = !0,
                this
            }
        },
        setPixel32: function(a, b, d, e, f, g, h) {
            return void 0 === h && (h = !0),
            a >= 0 && a <= this.width && b >= 0 && b <= this.height && (this.pixels[b * this.width + a] = c.Device.LITTLE_ENDIAN ? g << 24 | f << 16 | e << 8 | d : d << 24 | e << 16 | f << 8 | g,
            h && (this.context.putImageData(this.imageData, 0, 0),
            this.dirty = !0)),
            this
        },
        setPixel: function(a, b, c, d, e, f) {
            return this.setPixel32(a, b, c, d, e, 255, f)
        },
        getPixel: function(a, b, d) {
            d || (d = c.Color.createColor());
            var e = ~~(a + b * this.width);
            return e *= 4,
            d.r = this.data[e],
            d.g = this.data[++e],
            d.b = this.data[++e],
            d.a = this.data[++e],
            d
        },
        getPixel32: function(a, b) {
            return a >= 0 && a <= this.width && b >= 0 && b <= this.height ? this.pixels[b * this.width + a] : void 0
        },
        getPixelRGB: function(a, b, d, e, f) {
            return c.Color.unpackPixel(this.getPixel32(a, b), d, e, f)
        },
        getPixels: function(a) {
            return this.context.getImageData(a.x, a.y, a.width, a.height)
        },
        getFirstPixel: function(a) {
            void 0 === a && (a = 0);
            var b = c.Color.createColor()
              , d = 0
              , e = 0
              , f = 1
              , g = !1;
            1 === a ? (f = -1,
            e = this.height) : 3 === a && (f = -1,
            d = this.width);
            do
                c.Color.unpackPixel(this.getPixel32(d, e), b),
                0 === a || 1 === a ? (d++,
                d === this.width && (d = 0,
                e += f,
                (e >= this.height || 0 >= e) && (g = !0))) : (2 === a || 3 === a) && (e++,
                e === this.height && (e = 0,
                d += f,
                (d >= this.width || 0 >= d) && (g = !0)));
            while (0 === b.a && !g);
            return b.x = d,
            b.y = e,
            b
        },
        getBounds: function(a) {
            return void 0 === a && (a = new c.Rectangle),
            a.x = this.getFirstPixel(2).x,
            a.x === this.width ? a.setTo(0, 0, 0, 0) : (a.y = this.getFirstPixel(0).y,
            a.width = this.getFirstPixel(3).x - a.x + 1,
            a.height = this.getFirstPixel(1).y - a.y + 1,
            a)
        },
        addToWorld: function(a, b, c, d, e, f) {
            e = e || 1,
            f = f || 1;
            var g = this.game.add.image(a, b, this);
            return g.anchor.set(c, d),
            g.scale.set(e, f),
            g
        },
        copy: function(a, b, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) {
            if ((void 0 === a || null === a) && (a = this),
            this._image = a,
            a instanceof c.Sprite || a instanceof c.Image || a instanceof c.Text || a instanceof PIXI.Sprite)
                this._pos.set(a.texture.crop.x, a.texture.crop.y),
                this._size.set(a.texture.crop.width, a.texture.crop.height),
                this._scale.set(a.scale.x, a.scale.y),
                this._anchor.set(a.anchor.x, a.anchor.y),
                this._rotate = a.rotation,
                this._alpha.current = a.alpha,
                this._image = a.texture.baseTexture.source,
                (void 0 === g || null === g) && (g = a.x),
                (void 0 === h || null === h) && (h = a.y),
                a.texture.trim && (g += a.texture.trim.x - a.anchor.x * a.texture.trim.width,
                h += a.texture.trim.y - a.anchor.y * a.texture.trim.height),
                16777215 !== a.tint && (a.cachedTint !== a.tint && (a.cachedTint = a.tint,
                a.tintedTexture = PIXI.CanvasTinter.getTintedTexture(a, a.tint)),
                this._image = a.tintedTexture);
            else {
                if (this._pos.set(0),
                this._scale.set(1),
                this._anchor.set(0),
                this._rotate = 0,
                this._alpha.current = 1,
                a instanceof c.BitmapData)
                    this._image = a.canvas;
                else if ("string" == typeof a) {
                    if (a = this.game.cache.getImage(a),
                    null === a)
                        return;
                    this._image = a
                }
                this._size.set(this._image.width, this._image.height)
            }
            if ((void 0 === b || null === b) && (b = 0),
            (void 0 === d || null === d) && (d = 0),
            e && (this._size.x = e),
            f && (this._size.y = f),
            (void 0 === g || null === g) && (g = b),
            (void 0 === h || null === h) && (h = d),
            (void 0 === i || null === i) && (i = this._size.x),
            (void 0 === j || null === j) && (j = this._size.y),
            "number" == typeof k && (this._rotate = k),
            "number" == typeof l && (this._anchor.x = l),
            "number" == typeof m && (this._anchor.y = m),
            "number" == typeof n && (this._scale.x = n),
            "number" == typeof o && (this._scale.y = o),
            "number" == typeof p && (this._alpha.current = p),
            void 0 === q && (q = null),
            void 0 === r && (r = !1),
            !(this._alpha.current <= 0 || 0 === this._scale.x || 0 === this._scale.y || 0 === this._size.x || 0 === this._size.y)) {
                var s = this.context;
                return this._alpha.prev = s.globalAlpha,
                s.save(),
                s.globalAlpha = this._alpha.current,
                q && (this.op = q),
                r && (g |= 0,
                h |= 0),
                s.translate(g, h),
                s.scale(this._scale.x, this._scale.y),
                s.rotate(this._rotate),
                s.drawImage(this._image, this._pos.x + b, this._pos.y + d, this._size.x, this._size.y, -i * this._anchor.x, -j * this._anchor.y, i, j),
                s.restore(),
                s.globalAlpha = this._alpha.prev,
                this.dirty = !0,
                this
            }
        },
        copyRect: function(a, b, c, d, e, f, g) {
            return this.copy(a, b.x, b.y, b.width, b.height, c, d, b.width, b.height, 0, 0, 0, 1, 1, e, f, g)
        },
        draw: function(a, b, c, d, e, f, g) {
            return this.copy(a, null, null, null, null, b, c, d, e, null, null, null, null, null, null, f, g)
        },
        drawGroup: function(a, b, c) {
            return a.total > 0 && a.forEachExists(this.copy, this, null, null, null, null, null, null, null, null, null, null, null, null, null, null, b, c),
            this
        },
        drawFull: function(a, b, d) {
            if (a.worldVisible === !1 || 0 === a.worldAlpha || a.hasOwnProperty("exists") && a.exists === !1)
                return this;
            if (a.type !== c.GROUP && a.type !== c.EMITTER && a.type !== c.BITMAPTEXT)
                if (a.type === c.GRAPHICS) {
                    var e = a.getBounds();
                    this.ctx.save(),
                    this.ctx.translate(e.x, e.y),
                    PIXI.CanvasGraphics.renderGraphics(a, this.ctx),
                    this.ctx.restore()
                } else
                    this.copy(a, null, null, null, null, a.worldPosition.x, a.worldPosition.y, null, null, a.worldRotation, null, null, a.worldScale.x, a.worldScale.y, a.worldAlpha, b, d);
            if (a.children)
                for (var f = 0; f < a.children.length; f++)
                    this.drawFull(a.children[f], b, d);
            return this
        },
        shadow: function(a, b, c, d) {
            var e = this.context;
            void 0 === a || null === a ? e.shadowColor = "rgba(0,0,0,0)" : (e.shadowColor = a,
            e.shadowBlur = b || 5,
            e.shadowOffsetX = c || 10,
            e.shadowOffsetY = d || 10)
        },
        alphaMask: function(a, b, c, d) {
            return void 0 === d || null === d ? this.draw(b).blendSourceAtop() : this.draw(b, d.x, d.y, d.width, d.height).blendSourceAtop(),
            void 0 === c || null === c ? this.draw(a).blendReset() : this.draw(a, c.x, c.y, c.width, c.height).blendReset(),
            this
        },
        extract: function(a, b, c, d, e, f, g, h, i) {
            return void 0 === e && (e = 255),
            void 0 === f && (f = !1),
            void 0 === g && (g = b),
            void 0 === h && (h = c),
            void 0 === i && (i = d),
            f && a.resize(this.width, this.height),
            this.processPixelRGB(function(f, j, k) {
                return f.r === b && f.g === c && f.b === d && a.setPixel32(j, k, g, h, i, e, !1),
                !1
            }, this),
            a.context.putImageData(a.imageData, 0, 0),
            a.dirty = !0,
            a
        },
        rect: function(a, b, c, d, e) {
            return "undefined" != typeof e && (this.context.fillStyle = e),
            this.context.fillRect(a, b, c, d),
            this
        },
        text: function(a, b, c, d, e, f) {
            void 0 === b && (b = 0),
            void 0 === c && (c = 0),
            void 0 === d && (d = "14px Courier"),
            void 0 === e && (e = "rgb(255,255,255)"),
            void 0 === f && (f = !0);
            var g = this.context
              , h = g.font;
            g.font = d,
            f && (g.fillStyle = "rgb(0,0,0)",
            g.fillText(a, b + 1, c + 1)),
            g.fillStyle = e,
            g.fillText(a, b, c),
            g.font = h
        },
        circle: function(a, b, c, d) {
            var e = this.context;
            return void 0 !== d && (e.fillStyle = d),
            e.beginPath(),
            e.arc(a, b, c, 0, 2 * Math.PI, !1),
            e.closePath(),
            e.fill(),
            this
        },
        line: function(a, b, c, d, e, f) {
            void 0 === e && (e = "#fff"),
            void 0 === f && (f = 1);
            var g = this.context;
            return g.beginPath(),
            g.moveTo(a, b),
            g.lineTo(c, d),
            g.lineWidth = f,
            g.strokeStyle = e,
            g.stroke(),
            g.closePath(),
            this
        },
        textureLine: function(a, b, d) {
            if (void 0 === d && (d = "repeat-x"),
            "string" != typeof b || (b = this.game.cache.getImage(b))) {
                var e = a.length;
                "no-repeat" === d && e > b.width && (e = b.width);
                var f = this.context;
                return f.fillStyle = f.createPattern(b, d),
                this._circle = new c.Circle(a.start.x,a.start.y,b.height),
                this._circle.circumferencePoint(a.angle - 1.5707963267948966, !1, this._pos),
                f.save(),
                f.translate(this._pos.x, this._pos.y),
                f.rotate(a.angle),
                f.fillRect(0, 0, e, b.height),
                f.restore(),
                this.dirty = !0,
                this
            }
        },
        render: function() {
            return !this.disableTextureUpload && this.dirty && (this.baseTexture.dirty(),
            this.dirty = !1),
            this
        },
        destroy: function() {
            PIXI.CanvasPool.remove(this)
        },
        blendReset: function() {
            return this.op = "source-over",
            this
        },
        blendSourceOver: function() {
            return this.op = "source-over",
            this
        },
        blendSourceIn: function() {
            return this.op = "source-in",
            this
        },
        blendSourceOut: function() {
            return this.op = "source-out",
            this
        },
        blendSourceAtop: function() {
            return this.op = "source-atop",
            this
        },
        blendDestinationOver: function() {
            return this.op = "destination-over",
            this
        },
        blendDestinationIn: function() {
            return this.op = "destination-in",
            this
        },
        blendDestinationOut: function() {
            return this.op = "destination-out",
            this
        },
        blendDestinationAtop: function() {
            return this.op = "destination-atop",
            this
        },
        blendXor: function() {
            return this.op = "xor",
            this
        },
        blendAdd: function() {
            return this.op = "lighter",
            this
        },
        blendMultiply: function() {
            return this.op = "multiply",
            this
        },
        blendScreen: function() {
            return this.op = "screen",
            this
        },
        blendOverlay: function() {
            return this.op = "overlay",
            this
        },
        blendDarken: function() {
            return this.op = "darken",
            this
        },
        blendLighten: function() {
            return this.op = "lighten",
            this
        },
        blendColorDodge: function() {
            return this.op = "color-dodge",
            this
        },
        blendColorBurn: function() {
            return this.op = "color-burn",
            this
        },
        blendHardLight: function() {
            return this.op = "hard-light",
            this
        },
        blendSoftLight: function() {
            return this.op = "soft-light",
            this
        },
        blendDifference: function() {
            return this.op = "difference",
            this
        },
        blendExclusion: function() {
            return this.op = "exclusion",
            this
        },
        blendHue: function() {
            return this.op = "hue",
            this
        },
        blendSaturation: function() {
            return this.op = "saturation",
            this
        },
        blendColor: function() {
            return this.op = "color",
            this
        },
        blendLuminosity: function() {
            return this.op = "luminosity",
            this
        }
    },
    Object.defineProperty(c.BitmapData.prototype, "smoothed", {
        get: function() {
            c.Canvas.getSmoothingEnabled(this.context)
        },
        set: function(a) {
            c.Canvas.setSmoothingEnabled(this.context, a)
        }
    }),
    Object.defineProperty(c.BitmapData.prototype, "op", {
        get: function() {
            return this.context.globalCompositeOperation
        },
        set: function(a) {
            this.context.globalCompositeOperation = a
        }
    }),
    c.BitmapData.getTransform = function(a, b, c, d, e, f) {
        return "number" != typeof a && (a = 0),
        "number" != typeof b && (b = 0),
        "number" != typeof c && (c = 1),
        "number" != typeof d && (d = 1),
        "number" != typeof e && (e = 0),
        "number" != typeof f && (f = 0),
        {
            sx: c,
            sy: d,
            scaleX: c,
            scaleY: d,
            skewX: e,
            skewY: f,
            translateX: a,
            translateY: b,
            tx: a,
            ty: b
        }
    }
    ,
    c.BitmapData.prototype.constructor = c.BitmapData,
    PIXI.Graphics = function() {
        PIXI.DisplayObjectContainer.call(this),
        this.renderable = !0,
        this.fillAlpha = 1,
        this.lineWidth = 0,
        this.lineColor = 0,
        this.graphicsData = [],
        this.tint = 16777215,
        this.blendMode = PIXI.blendModes.NORMAL,
        this.currentPath = null,
        this._webGL = [],
        this.isMask = !1,
        this.boundsPadding = 0,
        this._localBounds = new PIXI.Rectangle(0,0,1,1),
        this.dirty = !0,
        this.webGLDirty = !1,
        this.cachedSpriteDirty = !1
    }
    ,
    PIXI.Graphics.prototype = Object.create(PIXI.DisplayObjectContainer.prototype),
    PIXI.Graphics.prototype.constructor = PIXI.Graphics,
    PIXI.Graphics.prototype.lineStyle = function(a, b, c) {
        return this.lineWidth = a || 0,
        this.lineColor = b || 0,
        this.lineAlpha = void 0 === c ? 1 : c,
        this.currentPath && (this.currentPath.shape.points.length ? this.drawShape(new PIXI.Polygon(this.currentPath.shape.points.slice(-2))) : (this.currentPath.lineWidth = this.lineWidth,
        this.currentPath.lineColor = this.lineColor,
        this.currentPath.lineAlpha = this.lineAlpha)),
        this
    }
    ,
    PIXI.Graphics.prototype.moveTo = function(a, b) {
        return this.drawShape(new PIXI.Polygon([a, b])),
        this
    }
    ,
    PIXI.Graphics.prototype.lineTo = function(a, b) {
        return this.currentPath || this.moveTo(0, 0),
        this.currentPath.shape.points.push(a, b),
        this.dirty = !0,
        this
    }
    ,
    PIXI.Graphics.prototype.quadraticCurveTo = function(a, b, c, d) {
        this.currentPath ? 0 === this.currentPath.shape.points.length && (this.currentPath.shape.points = [0, 0]) : this.moveTo(0, 0);
        var e, f, g = 20, h = this.currentPath.shape.points;
        0 === h.length && this.moveTo(0, 0);
        for (var i = h[h.length - 2], j = h[h.length - 1], k = 0, l = 1; g >= l; ++l)
            k = l / g,
            e = i + (a - i) * k,
            f = j + (b - j) * k,
            h.push(e + (a + (c - a) * k - e) * k, f + (b + (d - b) * k - f) * k);
        return this.dirty = !0,
        this
    }
    ,
    PIXI.Graphics.prototype.bezierCurveTo = function(a, b, c, d, e, f) {
        this.currentPath ? 0 === this.currentPath.shape.points.length && (this.currentPath.shape.points = [0, 0]) : this.moveTo(0, 0);
        for (var g, h, i, j, k, l = 20, m = this.currentPath.shape.points, n = m[m.length - 2], o = m[m.length - 1], p = 0, q = 1; l >= q; ++q)
            p = q / l,
            g = 1 - p,
            h = g * g,
            i = h * g,
            j = p * p,
            k = j * p,
            m.push(i * n + 3 * h * p * a + 3 * g * j * c + k * e, i * o + 3 * h * p * b + 3 * g * j * d + k * f);
        return this.dirty = !0,
        this
    }
    ,
    PIXI.Graphics.prototype.arcTo = function(a, b, c, d, e) {
        this.currentPath ? 0 === this.currentPath.shape.points.length && this.currentPath.shape.points.push(a, b) : this.moveTo(a, b);
        var f = this.currentPath.shape.points
          , g = f[f.length - 2]
          , h = f[f.length - 1]
          , i = h - b
          , j = g - a
          , k = d - b
          , l = c - a
          , m = Math.abs(i * l - j * k);
        if (1e-8 > m || 0 === e)
            (f[f.length - 2] !== a || f[f.length - 1] !== b) && f.push(a, b);
        else {
            var n = i * i + j * j
              , o = k * k + l * l
              , p = i * k + j * l
              , q = e * Math.sqrt(n) / m
              , r = e * Math.sqrt(o) / m
              , s = q * p / n
              , t = r * p / o
              , u = q * l + r * j
              , v = q * k + r * i
              , w = j * (r + s)
              , x = i * (r + s)
              , y = l * (q + t)
              , z = k * (q + t)
              , A = Math.atan2(x - v, w - u)
              , B = Math.atan2(z - v, y - u);
            this.arc(u + a, v + b, e, A, B, j * k > l * i)
        }
        return this.dirty = !0,
        this
    }
    ,
    PIXI.Graphics.prototype.arc = function(a, b, c, d, e, f) {
        if (d === e)
            return this;
        void 0 === f && (f = !1),
        !f && d >= e ? e += 2 * Math.PI : f && e >= d && (d += 2 * Math.PI);
        var g = f ? -1 * (d - e) : e - d
          , h = 40 * Math.ceil(Math.abs(g) / (2 * Math.PI));
        if (0 === g)
            return this;
        var i = a + Math.cos(d) * c
          , j = b + Math.sin(d) * c;
        f && this.filling ? this.moveTo(a, b) : this.moveTo(i, j);
        for (var k = this.currentPath.shape.points, l = g / (2 * h), m = 2 * l, n = Math.cos(l), o = Math.sin(l), p = h - 1, q = p % 1 / p, r = 0; p >= r; r++) {
            var s = r + q * r
              , t = l + d + m * s
              , u = Math.cos(t)
              , v = -Math.sin(t);
            k.push((n * u + o * v) * c + a, (n * -v + o * u) * c + b)
        }
        return this.dirty = !0,
        this
    }
    ,
    PIXI.Graphics.prototype.beginFill = function(a, b) {
        return this.filling = !0,
        this.fillColor = a || 0,
        this.fillAlpha = void 0 === b ? 1 : b,
        this.currentPath && this.currentPath.shape.points.length <= 2 && (this.currentPath.fill = this.filling,
        this.currentPath.fillColor = this.fillColor,
        this.currentPath.fillAlpha = this.fillAlpha),
        this
    }
    ,
    PIXI.Graphics.prototype.endFill = function() {
        return this.filling = !1,
        this.fillColor = null,
        this.fillAlpha = 1,
        this
    }
    ,
    PIXI.Graphics.prototype.drawRect = function(a, b, c, d) {
        return this.drawShape(new PIXI.Rectangle(a,b,c,d)),
        this
    }
    ,
    PIXI.Graphics.prototype.drawRoundedRect = function(a, b, c, d, e) {
        return this.drawShape(new PIXI.RoundedRectangle(a,b,c,d,e)),
        this
    }
    ,
    PIXI.Graphics.prototype.drawCircle = function(a, b, c) {
        return this.drawShape(new PIXI.Circle(a,b,c)),
        this
    }
    ,
    PIXI.Graphics.prototype.drawEllipse = function(a, b, c, d) {
        return this.drawShape(new PIXI.Ellipse(a,b,c,d)),
        this
    }
    ,
    PIXI.Graphics.prototype.drawPolygon = function(a) {
        (a instanceof c.Polygon || a instanceof PIXI.Polygon) && (a = a.points);
        var b = a;
        if (!Array.isArray(b)) {
            b = new Array(arguments.length);
            for (var d = 0; d < b.length; ++d)
                b[d] = arguments[d]
        }
        return this.drawShape(new c.Polygon(b)),
        this
    }
    ,
    PIXI.Graphics.prototype.clear = function() {
        return this.lineWidth = 0,
        this.filling = !1,
        this.dirty = !0,
        this.clearDirty = !0,
        this.graphicsData = [],
        this
    }
    ,
    PIXI.Graphics.prototype.generateTexture = function(a, b) {
        a = a || 1;
        var c = this.getBounds()
          , d = new PIXI.CanvasBuffer(c.width * a,c.height * a)
          , e = PIXI.Texture.fromCanvas(d.canvas, b);
        return e.baseTexture.resolution = a,
        d.context.scale(a, a),
        d.context.translate(-c.x, -c.y),
        PIXI.CanvasGraphics.renderGraphics(this, d.context),
        e
    }
    ,
    PIXI.Graphics.prototype._renderWebGL = function(a) {
        if (this.visible !== !1 && 0 !== this.alpha && this.isMask !== !0) {
            if (this._cacheAsBitmap)
                return (this.dirty || this.cachedSpriteDirty) && (this._generateCachedSprite(),
                this.updateCachedSpriteTexture(),
                this.cachedSpriteDirty = !1,
                this.dirty = !1),
                this._cachedSprite.worldAlpha = this.worldAlpha,
                void PIXI.Sprite.prototype._renderWebGL.call(this._cachedSprite, a);
            if (a.spriteBatch.stop(),
            a.blendModeManager.setBlendMode(this.blendMode),
            this._mask && a.maskManager.pushMask(this._mask, a),
            this._filters && a.filterManager.pushFilter(this._filterBlock),
            this.blendMode !== a.spriteBatch.currentBlendMode) {
                a.spriteBatch.currentBlendMode = this.blendMode;
                var b = PIXI.blendModesWebGL[a.spriteBatch.currentBlendMode];
                a.spriteBatch.gl.blendFunc(b[0], b[1])
            }
            if (this.webGLDirty && (this.dirty = !0,
            this.webGLDirty = !1),
            PIXI.WebGLGraphics.renderGraphics(this, a),
            this.children.length) {
                a.spriteBatch.start();
                for (var c = 0; c < this.children.length; c++)
                    this.children[c]._renderWebGL(a);
                a.spriteBatch.stop()
            }
            this._filters && a.filterManager.popFilter(),
            this._mask && a.maskManager.popMask(this.mask, a),
            a.drawCount++,
            a.spriteBatch.start()
        }
    }
    ,
    PIXI.Graphics.prototype._renderCanvas = function(a) {
        if (this.visible !== !1 && 0 !== this.alpha && this.isMask !== !0) {
            if (this._prevTint !== this.tint && (this.dirty = !0,
            this._prevTint = this.tint),
            this._cacheAsBitmap)
                return (this.dirty || this.cachedSpriteDirty) && (this._generateCachedSprite(),
                this.updateCachedSpriteTexture(),
                this.cachedSpriteDirty = !1,
                this.dirty = !1),
                this._cachedSprite.alpha = this.alpha,
                void PIXI.Sprite.prototype._renderCanvas.call(this._cachedSprite, a);
            var b = a.context
              , c = this.worldTransform;
            this.blendMode !== a.currentBlendMode && (a.currentBlendMode = this.blendMode,
            b.globalCompositeOperation = PIXI.blendModesCanvas[a.currentBlendMode]),
            this._mask && a.maskManager.pushMask(this._mask, a);
            var d = a.resolution;
            b.setTransform(c.a * d, c.b * d, c.c * d, c.d * d, c.tx * d, c.ty * d),
            PIXI.CanvasGraphics.renderGraphics(this, b);
            for (var e = 0; e < this.children.length; e++)
                this.children[e]._renderCanvas(a);
            this._mask && a.maskManager.popMask(a)
        }
    }
    ,
    PIXI.Graphics.prototype.getBounds = function(a) {
        if (!this._currentBounds) {
            if (!this.renderable)
                return PIXI.EmptyRectangle;
            this.dirty && (this.updateLocalBounds(),
            this.webGLDirty = !0,
            this.cachedSpriteDirty = !0,
            this.dirty = !1);
            var b = this._localBounds
              , c = b.x
              , d = b.width + b.x
              , e = b.y
              , f = b.height + b.y
              , g = a || this.worldTransform
              , h = g.a
              , i = g.b
              , j = g.c
              , k = g.d
              , l = g.tx
              , m = g.ty
              , n = h * d + j * f + l
              , o = k * f + i * d + m
              , p = h * c + j * f + l
              , q = k * f + i * c + m
              , r = h * c + j * e + l
              , s = k * e + i * c + m
              , t = h * d + j * e + l
              , u = k * e + i * d + m
              , v = n
              , w = o
              , x = n
              , y = o;
            x = x > p ? p : x,
            x = x > r ? r : x,
            x = x > t ? t : x,
            y = y > q ? q : y,
            y = y > s ? s : y,
            y = y > u ? u : y,
            v = p > v ? p : v,
            v = r > v ? r : v,
            v = t > v ? t : v,
            w = q > w ? q : w,
            w = s > w ? s : w,
            w = u > w ? u : w,
            this._bounds.x = x,
            this._bounds.width = v - x,
            this._bounds.y = y,
            this._bounds.height = w - y,
            this._currentBounds = this._bounds
        }
        return this._currentBounds
    }
    ,
    PIXI.Graphics.prototype.containsPoint = function(a) {
        this.worldTransform.applyInverse(a, tempPoint);
        for (var b = this.graphicsData, c = 0; c < b.length; c++) {
            var d = b[c];
            if (d.fill && d.shape && d.shape.contains(tempPoint.x, tempPoint.y))
                return !0
        }
        return !1
    }
    ,
    PIXI.Graphics.prototype.updateLocalBounds = function() {
        var a = 1 / 0
          , b = -1 / 0
          , d = 1 / 0
          , e = -1 / 0;
        if (this.graphicsData.length)
            for (var f, g, h, i, j, k, l = 0; l < this.graphicsData.length; l++) {
                var m = this.graphicsData[l]
                  , n = m.type
                  , o = m.lineWidth;
                if (f = m.shape,
                n === PIXI.Graphics.RECT || n === PIXI.Graphics.RREC)
                    h = f.x - o / 2,
                    i = f.y - o / 2,
                    j = f.width + o,
                    k = f.height + o,
                    a = a > h ? h : a,
                    b = h + j > b ? h + j : b,
                    d = d > i ? i : d,
                    e = i + k > e ? i + k : e;
                else if (n === PIXI.Graphics.CIRC)
                    h = f.x,
                    i = f.y,
                    j = f.radius + o / 2,
                    k = f.radius + o / 2,
                    a = a > h - j ? h - j : a,
                    b = h + j > b ? h + j : b,
                    d = d > i - k ? i - k : d,
                    e = i + k > e ? i + k : e;
                else if (n === PIXI.Graphics.ELIP)
                    h = f.x,
                    i = f.y,
                    j = f.width + o / 2,
                    k = f.height + o / 2,
                    a = a > h - j ? h - j : a,
                    b = h + j > b ? h + j : b,
                    d = d > i - k ? i - k : d,
                    e = i + k > e ? i + k : e;
                else {
                    g = f.points;
                    for (var p = 0; p < g.length; p++)
                        g[p]instanceof c.Point ? (h = g[p].x,
                        i = g[p].y) : (h = g[p],
                        i = g[p + 1],
                        p < g.length - 1 && p++),
                        a = a > h - o ? h - o : a,
                        b = h + o > b ? h + o : b,
                        d = d > i - o ? i - o : d,
                        e = i + o > e ? i + o : e
                }
            }
        else
            a = 0,
            b = 0,
            d = 0,
            e = 0;
        var q = this.boundsPadding;
        this._localBounds.x = a - q,
        this._localBounds.width = b - a + 2 * q,
        this._localBounds.y = d - q,
        this._localBounds.height = e - d + 2 * q
    }
    ,
    PIXI.Graphics.prototype._generateCachedSprite = function() {
        var a = this.getLocalBounds();
        if (this._cachedSprite)
            this._cachedSprite.buffer.resize(a.width, a.height);
        else {
            var b = new PIXI.CanvasBuffer(a.width,a.height)
              , c = PIXI.Texture.fromCanvas(b.canvas);
            this._cachedSprite = new PIXI.Sprite(c),
            this._cachedSprite.buffer = b,
            this._cachedSprite.worldTransform = this.worldTransform
        }
        this._cachedSprite.anchor.x = -(a.x / a.width),
        this._cachedSprite.anchor.y = -(a.y / a.height),
        this._cachedSprite.buffer.context.translate(-a.x, -a.y),
        this.worldAlpha = 1,
        PIXI.CanvasGraphics.renderGraphics(this, this._cachedSprite.buffer.context),
        this._cachedSprite.alpha = this.alpha
    }
    ,
    PIXI.Graphics.prototype.updateCachedSpriteTexture = function() {
        var a = this._cachedSprite
          , b = a.texture
          , c = a.buffer.canvas;
        b.baseTexture.width = c.width,
        b.baseTexture.height = c.height,
        b.crop.width = b.frame.width = c.width,
        b.crop.height = b.frame.height = c.height,
        a._width = c.width,
        a._height = c.height,
        b.baseTexture.dirty()
    }
    ,
    PIXI.Graphics.prototype.destroyCachedSprite = function() {
        this._cachedSprite.texture.destroy(!0),
        this._cachedSprite = null
    }
    ,
    PIXI.Graphics.prototype.drawShape = function(a) {
        this.currentPath && this.currentPath.shape.points.length <= 2 && this.graphicsData.pop(),
        this.currentPath = null,
        a instanceof c.Polygon && (a = a.clone(),
        a.flatten());
        var b = new PIXI.GraphicsData(this.lineWidth,this.lineColor,this.lineAlpha,this.fillColor,this.fillAlpha,this.filling,a);
        return this.graphicsData.push(b),
        b.type === PIXI.Graphics.POLY && (b.shape.closed = this.filling,
        this.currentPath = b),
        this.dirty = !0,
        b
    }
    ,
    Object.defineProperty(PIXI.Graphics.prototype, "cacheAsBitmap", {
        get: function() {
            return this._cacheAsBitmap
        },
        set: function(a) {
            this._cacheAsBitmap = a,
            this._cacheAsBitmap ? this._generateCachedSprite() : (this.destroyCachedSprite(),
            this.dirty = !0)
        }
    }),
    PIXI.GraphicsData = function(a, b, c, d, e, f, g) {
        this.lineWidth = a,
        this.lineColor = b,
        this.lineAlpha = c,
        this._lineTint = b,
        this.fillColor = d,
        this.fillAlpha = e,
        this._fillTint = d,
        this.fill = f,
        this.shape = g,
        this.type = g.type
    }
    ,
    PIXI.GraphicsData.prototype.constructor = PIXI.GraphicsData,
    PIXI.GraphicsData.prototype.clone = function() {
        return new GraphicsData(this.lineWidth,this.lineColor,this.lineAlpha,this.fillColor,this.fillAlpha,this.fill,this.shape)
    }
    ,
    c.Graphics = function(a, b, d) {
        void 0 === b && (b = 0),
        void 0 === d && (d = 0),
        this.type = c.GRAPHICS,
        this.physicsType = c.SPRITE,
        PIXI.Graphics.call(this),
        c.Component.Core.init.call(this, a, b, d, "", null)
    }
    ,
    c.Graphics.prototype = Object.create(PIXI.Graphics.prototype),
    c.Graphics.prototype.constructor = c.Graphics,
    c.Component.Core.install.call(c.Graphics.prototype, ["Angle", "AutoCull", "Bounds", "Destroy", "FixedToCamera", "InputEnabled", "InWorld", "LifeSpan", "PhysicsBody", "Reset"]),
    c.Graphics.prototype.preUpdatePhysics = c.Component.PhysicsBody.preUpdate,
    c.Graphics.prototype.preUpdateLifeSpan = c.Component.LifeSpan.preUpdate,
    c.Graphics.prototype.preUpdateInWorld = c.Component.InWorld.preUpdate,
    c.Graphics.prototype.preUpdateCore = c.Component.Core.preUpdate,
    c.Graphics.prototype.preUpdate = function() {
        return this.preUpdatePhysics() && this.preUpdateLifeSpan() && this.preUpdateInWorld() ? this.preUpdateCore() : !1
    }
    ,
    c.Graphics.prototype.destroy = function(a) {
        this.clear(),
        c.Component.Destroy.prototype.destroy.call(this, a)
    }
    ,
    c.Graphics.prototype.drawTriangle = function(a, b) {
        void 0 === b && (b = !1);
        var d = new c.Polygon(a);
        if (b) {
            var e = new c.Point(this.game.camera.x - a[0].x,this.game.camera.y - a[0].y)
              , f = new c.Point(a[1].x - a[0].x,a[1].y - a[0].y)
              , g = new c.Point(a[1].x - a[2].x,a[1].y - a[2].y)
              , h = g.cross(f);
            e.dot(h) > 0 && this.drawPolygon(d)
        } else
            this.drawPolygon(d)
    }
    ,
    c.Graphics.prototype.drawTriangles = function(a, b, d) {
        void 0 === d && (d = !1);
        var e, f = new c.Point, g = new c.Point, h = new c.Point, i = [];
        if (b)
            if (a[0]instanceof c.Point)
                for (e = 0; e < b.length / 3; e++)
                    i.push(a[b[3 * e]]),
                    i.push(a[b[3 * e + 1]]),
                    i.push(a[b[3 * e + 2]]),
                    3 === i.length && (this.drawTriangle(i, d),
                    i = []);
            else
                for (e = 0; e < b.length; e++)
                    f.x = a[2 * b[e]],
                    f.y = a[2 * b[e] + 1],
                    i.push(f.copyTo({})),
                    3 === i.length && (this.drawTriangle(i, d),
                    i = []);
        else if (a[0]instanceof c.Point)
            for (e = 0; e < a.length / 3; e++)
                this.drawTriangle([a[3 * e], a[3 * e + 1], a[3 * e + 2]], d);
        else
            for (e = 0; e < a.length / 6; e++)
                f.x = a[6 * e + 0],
                f.y = a[6 * e + 1],
                g.x = a[6 * e + 2],
                g.y = a[6 * e + 3],
                h.x = a[6 * e + 4],
                h.y = a[6 * e + 5],
                this.drawTriangle([f, g, h], d)
    }
    ,
    c.RenderTexture = function(a, b, d, e, f, g) {
        void 0 === e && (e = ""),
        void 0 === f && (f = c.scaleModes.DEFAULT),
        void 0 === g && (g = 1),
        this.game = a,
        this.key = e,
        this.type = c.RENDERTEXTURE,
        this._tempMatrix = new PIXI.Matrix,
        PIXI.RenderTexture.call(this, b, d, this.game.renderer, f, g),
        this.render = c.RenderTexture.prototype.render
    }
    ,
    c.RenderTexture.prototype = Object.create(PIXI.RenderTexture.prototype),
    c.RenderTexture.prototype.constructor = c.RenderTexture,
    c.RenderTexture.prototype.renderXY = function(a, b, c, d) {
        a.updateTransform(),
        this._tempMatrix.copyFrom(a.worldTransform),
        this._tempMatrix.tx = b,
        this._tempMatrix.ty = c,
        this.renderer.type === PIXI.WEBGL_RENDERER ? this.renderWebGL(a, this._tempMatrix, d) : this.renderCanvas(a, this._tempMatrix, d)
    }
    ,
    c.RenderTexture.prototype.renderRawXY = function(a, b, c, d) {
        this._tempMatrix.identity().translate(b, c),
        this.renderer.type === PIXI.WEBGL_RENDERER ? this.renderWebGL(a, this._tempMatrix, d) : this.renderCanvas(a, this._tempMatrix, d)
    }
    ,
    c.RenderTexture.prototype.render = function(a, b, c) {
        this._tempMatrix.copyFrom(void 0 === b || null === b ? a.worldTransform : b),
        this.renderer.type === PIXI.WEBGL_RENDERER ? this.renderWebGL(a, this._tempMatrix, c) : this.renderCanvas(a, this._tempMatrix, c)
    }
    ,
    c.Text = function(a, b, d, e, f) {
        b = b || 0,
        d = d || 0,
        e = void 0 === e || null === e ? "" : e.toString(),
        f = f || {},
        this.type = c.TEXT,
        this.physicsType = c.SPRITE,
        this.padding = new c.Point,
        this.textBounds = null,
        this.canvas = PIXI.CanvasPool.create(this),
        this.context = this.canvas.getContext("2d"),
        this.colors = [],
        this.strokeColors = [],
        this.fontStyles = [],
        this.fontWeights = [],
        this.autoRound = !1,
        this._res = a.renderer.resolution,
        this._text = e,
        this._fontComponents = null,
        this._lineSpacing = 0,
        this._charCount = 0,
        this._width = 0,
        this._height = 0,
        c.Sprite.call(this, a, b, d, PIXI.Texture.fromCanvas(this.canvas)),
        this.setStyle(f),
        "" !== e && this.updateText()
    }
    ,
    c.Text.prototype = Object.create(c.Sprite.prototype),
    c.Text.prototype.constructor = c.Text,
    c.Text.prototype.preUpdate = function() {
        return this.preUpdatePhysics() && this.preUpdateLifeSpan() && this.preUpdateInWorld() ? this.preUpdateCore() : !1
    }
    ,
    c.Text.prototype.update = function() {}
    ,
    c.Text.prototype.destroy = function(a) {
        this.texture.destroy(!0),
        PIXI.CanvasPool.remove(this),
        c.Component.Destroy.prototype.destroy.call(this, a)
    }
    ,
    c.Text.prototype.setShadow = function(a, b, c, d, e, f) {
        return void 0 === a && (a = 0),
        void 0 === b && (b = 0),
        void 0 === c && (c = "rgba(0, 0, 0, 1)"),
        void 0 === d && (d = 0),
        void 0 === e && (e = !0),
        void 0 === f && (f = !0),
        this.style.shadowOffsetX = a,
        this.style.shadowOffsetY = b,
        this.style.shadowColor = c,
        this.style.shadowBlur = d,
        this.style.shadowStroke = e,
        this.style.shadowFill = f,
        this.dirty = !0,
        this
    }
    ,
    c.Text.prototype.setStyle = function(a) {
        a = a || {},
        a.font = a.font || "bold 20pt Arial",
        a.backgroundColor = a.backgroundColor || null,
        a.fill = a.fill || "black",
        a.align = a.align || "left",
        a.boundsAlignH = a.boundsAlignH || "left",
        a.boundsAlignV = a.boundsAlignV || "top",
        a.stroke = a.stroke || "black",
        a.strokeThickness = a.strokeThickness || 0,
        a.wordWrap = a.wordWrap || !1,
        a.wordWrapWidth = a.wordWrapWidth || 100,
        a.shadowOffsetX = a.shadowOffsetX || 0,
        a.shadowOffsetY = a.shadowOffsetY || 0,
        a.shadowColor = a.shadowColor || "rgba(0,0,0,0)",
        a.shadowBlur = a.shadowBlur || 0,
        a.tabs = a.tabs || 0;
        var b = this.fontToComponents(a.font);
        return a.fontStyle && (b.fontStyle = a.fontStyle),
        a.fontVariant && (b.fontVariant = a.fontVariant),
        a.fontWeight && (b.fontWeight = a.fontWeight),
        a.fontSize && ("number" == typeof a.fontSize && (a.fontSize = a.fontSize + "px"),
        b.fontSize = a.fontSize),
        this._fontComponents = b,
        a.font = this.componentsToFont(this._fontComponents),
        this.style = a,
        this.dirty = !0,
        this
    }
    ,
    c.Text.prototype.updateText = function() {
        this.texture.baseTexture.resolution = this._res,
        this.context.font = this.style.font;
        var a = this.text;
        this.style.wordWrap && (a = this.runWordWrap(this.text));
        for (var b = a.split(/(?:\r\n|\r|\n)/), c = this.style.tabs, d = [], e = 0, f = this.determineFontProperties(this.style.font), g = 0; g < b.length; g++) {
            if (0 === c)
                var h = this.context.measureText(b[g]).width + this.style.strokeThickness + this.padding.x;
            else {
                var i = b[g].split(/(?:\t)/)
                  , h = this.padding.x + this.style.strokeThickness;
                if (Array.isArray(c))
                    for (var j = 0, k = 0; k < i.length; k++) {
                        var l = Math.ceil(this.context.measureText(i[k]).width);
                        k > 0 && (j += c[k - 1]),
                        h = j + l
                    }
                else
                    for (var k = 0; k < i.length; k++) {
                        h += Math.ceil(this.context.measureText(i[k]).width);
                        var m = this.game.math.snapToCeil(h, c) - h;
                        h += m
                    }
            }
            d[g] = Math.ceil(h),
            e = Math.max(e, d[g])
        }
        var n = e + this.style.strokeThickness;
        this.canvas.width = n * this._res;
        var o = f.fontSize + this.style.strokeThickness + this.padding.y
          , p = o * b.length
          , q = this._lineSpacing;
        if (0 > q && Math.abs(q) > o && (q = -o),
        0 !== q) {
            var m = q * (b.length - 1);
            p += m
        }
        this.canvas.height = p * this._res,
        this.context.scale(this._res, this._res),
        navigator.isCocoonJS && this.context.clearRect(0, 0, this.canvas.width, this.canvas.height),
        this.style.backgroundColor && (this.context.fillStyle = this.style.backgroundColor,
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)),
        this.context.fillStyle = this.style.fill,
        this.context.font = this.style.font,
        this.context.strokeStyle = this.style.stroke,
        this.context.textBaseline = "alphabetic",
        this.context.lineWidth = this.style.strokeThickness,
        this.context.lineCap = "round",
        this.context.lineJoin = "round";
        var r, s;
        for (this._charCount = 0,
        g = 0; g < b.length; g++)
            r = this.style.strokeThickness / 2,
            s = this.style.strokeThickness / 2 + g * o + f.ascent,
            g > 0 && (s += q * g),
            "right" === this.style.align ? r += e - d[g] : "center" === this.style.align && (r += (e - d[g]) / 2),
            this.autoRound && (r = Math.round(r),
            s = Math.round(s)),
            this.colors.length > 0 || this.strokeColors.length > 0 || this.fontWeights.length > 0 || this.fontStyles.length > 0 ? this.updateLine(b[g], r, s) : (this.style.stroke && this.style.strokeThickness && (this.updateShadow(this.style.shadowStroke),
            0 === c ? this.context.strokeText(b[g], r, s) : this.renderTabLine(b[g], r, s, !1)),
            this.style.fill && (this.updateShadow(this.style.shadowFill),
            0 === c ? this.context.fillText(b[g], r, s) : this.renderTabLine(b[g], r, s, !0)));
        this.updateTexture()
    }
    ,
    c.Text.prototype.renderTabLine = function(a, b, c, d) {
        var e = a.split(/(?:\t)/)
          , f = this.style.tabs
          , g = 0;
        if (Array.isArray(f))
            for (var h = 0, i = 0; i < e.length; i++)
                i > 0 && (h += f[i - 1]),
                g = b + h,
                d ? this.context.fillText(e[i], g, c) : this.context.strokeText(e[i], g, c);
        else
            for (var i = 0; i < e.length; i++) {
                var j = Math.ceil(this.context.measureText(e[i]).width);
                g = this.game.math.snapToCeil(b, f),
                d ? this.context.fillText(e[i], g, c) : this.context.strokeText(e[i], g, c),
                b = g + j
            }
    }
    ,
    c.Text.prototype.updateShadow = function(a) {
        a ? (this.context.shadowOffsetX = this.style.shadowOffsetX,
        this.context.shadowOffsetY = this.style.shadowOffsetY,
        this.context.shadowColor = this.style.shadowColor,
        this.context.shadowBlur = this.style.shadowBlur) : (this.context.shadowOffsetX = 0,
        this.context.shadowOffsetY = 0,
        this.context.shadowColor = 0,
        this.context.shadowBlur = 0)
    }
    ,
    c.Text.prototype.updateLine = function(a, b, c) {
        for (var d = 0; d < a.length; d++) {
            var e = a[d];
            if (this.fontWeights.length > 0 || this.fontStyles.length > 0) {
                var f = this.fontToComponents(this.context.font);
                this.fontStyles[this._charCount] && (f.fontStyle = this.fontStyles[this._charCount]),
                this.fontWeights[this._charCount] && (f.fontWeight = this.fontWeights[this._charCount]),
                this.context.font = this.componentsToFont(f)
            }
            this.style.stroke && this.style.strokeThickness && (this.strokeColors[this._charCount] && (this.context.strokeStyle = this.strokeColors[this._charCount]),
            this.updateShadow(this.style.shadowStroke),
            this.context.strokeText(e, b, c)),
            this.style.fill && (this.colors[this._charCount] && (this.context.fillStyle = this.colors[this._charCount]),
            this.updateShadow(this.style.shadowFill),
            this.context.fillText(e, b, c)),
            b += this.context.measureText(e).width,
            this._charCount++
        }
    }
    ,
    c.Text.prototype.clearColors = function() {
        return this.colors = [],
        this.strokeColors = [],
        this.dirty = !0,
        this
    }
    ,
    c.Text.prototype.clearFontValues = function() {
        return this.fontStyles = [],
        this.fontWeights = [],
        this.dirty = !0,
        this
    }
    ,
    c.Text.prototype.addColor = function(a, b) {
        return this.colors[b] = a,
        this.dirty = !0,
        this
    }
    ,
    c.Text.prototype.addStrokeColor = function(a, b) {
        return this.strokeColors[b] = a,
        this.dirty = !0,
        this
    }
    ,
    c.Text.prototype.addFontStyle = function(a, b) {
        return this.fontStyles[b] = a,
        this.dirty = !0,
        this
    }
    ,
    c.Text.prototype.addFontWeight = function(a, b) {
        return this.fontWeights[b] = a,
        this.dirty = !0,
        this
    }
    ,
    c.Text.prototype.runWordWrap = function(a) {
        for (var b = "", c = a.split("\n"), d = 0; d < c.length; d++) {
            for (var e = this.style.wordWrapWidth, f = c[d].split(" "), g = 0; g < f.length; g++) {
                var h = this.context.measureText(f[g]).width
                  , i = h + this.context.measureText(" ").width;
                i > e ? (g > 0 && (b += "\n"),
                b += f[g] + " ",
                e = this.style.wordWrapWidth - h) : (e -= i,
                b += f[g] + " ")
            }
            d < c.length - 1 && (b += "\n")
        }
        return b
    }
    ,
    c.Text.prototype.updateFont = function(a) {
        var b = this.componentsToFont(a);
        this.style.font !== b && (this.style.font = b,
        this.dirty = !0,
        this.parent && this.updateTransform())
    }
    ,
    c.Text.prototype.fontToComponents = function(a) {
        var b = a.match(/^\s*(?:\b(normal|italic|oblique|inherit)?\b)\s*(?:\b(normal|small-caps|inherit)?\b)\s*(?:\b(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit)?\b)\s*(?:\b(xx-small|x-small|small|medium|large|x-large|xx-large|larger|smaller|0|\d*(?:[.]\d*)?(?:%|[a-z]{2,5}))?\b)\s*(.*)\s*$/);
        return b ? {
            font: a,
            fontStyle: b[1] || "normal",
            fontVariant: b[2] || "normal",
            fontWeight: b[3] || "normal",
            fontSize: b[4] || "medium",
            fontFamily: b[5]
        } : (console.warn("Phaser.Text - unparsable CSS font: " + a),
        {
            font: a
        })
    }
    ,
    c.Text.prototype.componentsToFont = function(a) {
        var b, c = [];
        return b = a.fontStyle,
        b && "normal" !== b && c.push(b),
        b = a.fontVariant,
        b && "normal" !== b && c.push(b),
        b = a.fontWeight,
        b && "normal" !== b && c.push(b),
        b = a.fontSize,
        b && "medium" !== b && c.push(b),
        b = a.fontFamily,
        b && c.push(b),
        c.length || c.push(a.font),
        c.join(" ")
    }
    ,
    c.Text.prototype.setText = function(a) {
        return this.text = a.toString() || "",
        this.dirty = !0,
        this
    }
    ,
    c.Text.prototype.parseList = function(a) {
        if (!Array.isArray(a))
            return this;
        for (var b = "", c = 0; c < a.length; c++)
            Array.isArray(a[c]) ? (b += a[c].join("	"),
            c < a.length - 1 && (b += "\n")) : (b += a[c],
            c < a.length - 1 && (b += "	"));
        return this.text = b,
        this.dirty = !0,
        this
    }
    ,
    c.Text.prototype.setTextBounds = function(a, b, d, e) {
        return void 0 === a ? this.textBounds = null : (this.textBounds ? this.textBounds.setTo(a, b, d, e) : this.textBounds = new c.Rectangle(a,b,d,e),
        this.style.wordWrapWidth > d && (this.style.wordWrapWidth = d)),
        this.updateTexture(),
        this
    }
    ,
    c.Text.prototype.updateTexture = function() {
        var a = this.texture.baseTexture
          , b = this.texture.crop
          , c = this.texture.frame
          , d = this.canvas.width
          , e = this.canvas.height;
        if (a.width = d,
        a.height = e,
        b.width = d,
        b.height = e,
        c.width = d,
        c.height = e,
        this.texture.width = d,
        this.texture.height = e,
        this._width = d,
        this._height = e,
        this.textBounds) {
            var f = this.textBounds.x
              , g = this.textBounds.y;
            "right" === this.style.boundsAlignH ? f += this.textBounds.width - this.canvas.width : "center" === this.style.boundsAlignH && (f += this.textBounds.halfWidth - this.canvas.width / 2),
            "bottom" === this.style.boundsAlignV ? g += this.textBounds.height - this.canvas.height : "middle" === this.style.boundsAlignV && (g += this.textBounds.halfHeight - this.canvas.height / 2),
            this.pivot.x = -f,
            this.pivot.y = -g
        }
        this.renderable = 0 !== d && 0 !== e,
        this.texture.requiresReTint = !0,
        this.texture.baseTexture.dirty()
    }
    ,
    c.Text.prototype._renderWebGL = function(a) {
        this.dirty && (this.updateText(),
        this.dirty = !1),
        PIXI.Sprite.prototype._renderWebGL.call(this, a)
    }
    ,
    c.Text.prototype._renderCanvas = function(a) {
        this.dirty && (this.updateText(),
        this.dirty = !1),
        PIXI.Sprite.prototype._renderCanvas.call(this, a)
    }
    ,
    c.Text.prototype.determineFontProperties = function(a) {
        var b = c.Text.fontPropertiesCache[a];
        if (!b) {
            b = {};
            var d = c.Text.fontPropertiesCanvas
              , e = c.Text.fontPropertiesContext;
            e.font = a;
            var f = Math.ceil(e.measureText("|MÉq").width)
              , g = Math.ceil(e.measureText("|MÉq").width)
              , h = 2 * g;
            if (g = 1.4 * g | 0,
            d.width = f,
            d.height = h,
            e.fillStyle = "#f00",
            e.fillRect(0, 0, f, h),
            e.font = a,
            e.textBaseline = "alphabetic",
            e.fillStyle = "#000",
            e.fillText("|MÉq", 0, g),
            !e.getImageData(0, 0, f, h))
                return b.ascent = g,
                b.descent = g + 6,
                b.fontSize = b.ascent + b.descent,
                c.Text.fontPropertiesCache[a] = b,
                b;
            var i, j, k = e.getImageData(0, 0, f, h).data, l = k.length, m = 4 * f, n = 0, o = !1;
            for (i = 0; g > i; i++) {
                for (j = 0; m > j; j += 4)
                    if (255 !== k[n + j]) {
                        o = !0;
                        break
                    }
                if (o)
                    break;
                n += m
            }
            for (b.ascent = g - i,
            n = l - m,
            o = !1,
            i = h; i > g; i--) {
                for (j = 0; m > j; j += 4)
                    if (255 !== k[n + j]) {
                        o = !0;
                        break
                    }
                if (o)
                    break;
                n -= m
            }
            b.descent = i - g,
            b.descent += 6,
            b.fontSize = b.ascent + b.descent,
            c.Text.fontPropertiesCache[a] = b
        }
        return b
    }
    ,
    c.Text.prototype.getBounds = function(a) {
        return this.dirty && (this.updateText(),
        this.dirty = !1),
        PIXI.Sprite.prototype.getBounds.call(this, a)
    }
    ,
    Object.defineProperty(c.Text.prototype, "text", {
        get: function() {
            return this._text
        },
        set: function(a) {
            a !== this._text && (this._text = a.toString() || "",
            this.dirty = !0,
            this.parent && this.updateTransform())
        }
    }),
    Object.defineProperty(c.Text.prototype, "cssFont", {
        get: function() {
            return this.componentsToFont(this._fontComponents)
        },
        set: function(a) {
            a = a || "bold 20pt Arial",
            this._fontComponents = this.fontToComponents(a),
            this.updateFont(this._fontComponents)
        }
    }),
    Object.defineProperty(c.Text.prototype, "font", {
        get: function() {
            return this._fontComponents.fontFamily
        },
        set: function(a) {
            a = a || "Arial",
            a = a.trim(),
            /^(?:inherit|serif|sans-serif|cursive|fantasy|monospace)$/.exec(a) || /['",]/.exec(a) || (a = "'" + a + "'"),
            this._fontComponents.fontFamily = a,
            this.updateFont(this._fontComponents)
        }
    }),
    Object.defineProperty(c.Text.prototype, "fontSize", {
        get: function() {
            var a = this._fontComponents.fontSize;
            return a && /(?:^0$|px$)/.exec(a) ? parseInt(a, 10) : a
        },
        set: function(a) {
            a = a || "0",
            "number" == typeof a && (a += "px"),
            this._fontComponents.fontSize = a,
            this.updateFont(this._fontComponents)
        }
    }),
    Object.defineProperty(c.Text.prototype, "fontWeight", {
        get: function() {
            return this._fontComponents.fontWeight || "normal"
        },
        set: function(a) {
            a = a || "normal",
            this._fontComponents.fontWeight = a,
            this.updateFont(this._fontComponents)
        }
    }),
    Object.defineProperty(c.Text.prototype, "fontStyle", {
        get: function() {
            return this._fontComponents.fontStyle || "normal"
        },
        set: function(a) {
            a = a || "normal",
            this._fontComponents.fontStyle = a,
            this.updateFont(this._fontComponents)
        }
    }),
    Object.defineProperty(c.Text.prototype, "fontVariant", {
        get: function() {
            return this._fontComponents.fontVariant || "normal"
        },
        set: function(a) {
            a = a || "normal",
            this._fontComponents.fontVariant = a,
            this.updateFont(this._fontComponents)
        }
    }),
    Object.defineProperty(c.Text.prototype, "fill", {
        get: function() {
            return this.style.fill
        },
        set: function(a) {
            a !== this.style.fill && (this.style.fill = a,
            this.dirty = !0)
        }
    }),
    Object.defineProperty(c.Text.prototype, "align", {
        get: function() {
            return this.style.align
        },
        set: function(a) {
            a !== this.style.align && (this.style.align = a,
            this.dirty = !0)
        }
    }),
    Object.defineProperty(c.Text.prototype, "resolution", {
        get: function() {
            return this._res
        },
        set: function(a) {
            a !== this._res && (this._res = a,
            this.dirty = !0)
        }
    }),
    Object.defineProperty(c.Text.prototype, "tabs", {
        get: function() {
            return this.style.tabs
        },
        set: function(a) {
            a !== this.style.tabs && (this.style.tabs = a,
            this.dirty = !0)
        }
    }),
    Object.defineProperty(c.Text.prototype, "boundsAlignH", {
        get: function() {
            return this.style.boundsAlignH
        },
        set: function(a) {
            a !== this.style.boundsAlignH && (this.style.boundsAlignH = a,
            this.dirty = !0)
        }
    }),
    Object.defineProperty(c.Text.prototype, "boundsAlignV", {
        get: function() {
            return this.style.boundsAlignV
        },
        set: function(a) {
            a !== this.style.boundsAlignV && (this.style.boundsAlignV = a,
            this.dirty = !0)
        }
    }),
    Object.defineProperty(c.Text.prototype, "stroke", {
        get: function() {
            return this.style.stroke
        },
        set: function(a) {
            a !== this.style.stroke && (this.style.stroke = a,
            this.dirty = !0)
        }
    }),
    Object.defineProperty(c.Text.prototype, "strokeThickness", {
        get: function() {
            return this.style.strokeThickness
        },
        set: function(a) {
            a !== this.style.strokeThickness && (this.style.strokeThickness = a,
            this.dirty = !0)
        }
    }),
    Object.defineProperty(c.Text.prototype, "wordWrap", {
        get: function() {
            return this.style.wordWrap
        },
        set: function(a) {
            a !== this.style.wordWrap && (this.style.wordWrap = a,
            this.dirty = !0)
        }
    }),
    Object.defineProperty(c.Text.prototype, "wordWrapWidth", {
        get: function() {
            return this.style.wordWrapWidth
        },
        set: function(a) {
            a !== this.style.wordWrapWidth && (this.style.wordWrapWidth = a,
            this.dirty = !0)
        }
    }),
    Object.defineProperty(c.Text.prototype, "lineSpacing", {
        get: function() {
            return this._lineSpacing
        },
        set: function(a) {
            a !== this._lineSpacing && (this._lineSpacing = parseFloat(a),
            this.dirty = !0,
            this.parent && this.updateTransform())
        }
    }),
    Object.defineProperty(c.Text.prototype, "shadowOffsetX", {
        get: function() {
            return this.style.shadowOffsetX
        },
        set: function(a) {
            a !== this.style.shadowOffsetX && (this.style.shadowOffsetX = a,
            this.dirty = !0)
        }
    }),
    Object.defineProperty(c.Text.prototype, "shadowOffsetY", {
        get: function() {
            return this.style.shadowOffsetY
        },
        set: function(a) {
            a !== this.style.shadowOffsetY && (this.style.shadowOffsetY = a,
            this.dirty = !0)
        }
    }),
    Object.defineProperty(c.Text.prototype, "shadowColor", {
        get: function() {
            return this.style.shadowColor
        },
        set: function(a) {
            a !== this.style.shadowColor && (this.style.shadowColor = a,
            this.dirty = !0)
        }
    }),
    Object.defineProperty(c.Text.prototype, "shadowBlur", {
        get: function() {
            return this.style.shadowBlur
        },
        set: function(a) {
            a !== this.style.shadowBlur && (this.style.shadowBlur = a,
            this.dirty = !0)
        }
    }),
    Object.defineProperty(c.Text.prototype, "shadowStroke", {
        get: function() {
            return this.style.shadowStroke
        },
        set: function(a) {
            a !== this.style.shadowStroke && (this.style.shadowStroke = a,
            this.dirty = !0)
        }
    }),
    Object.defineProperty(c.Text.prototype, "shadowFill", {
        get: function() {
            return this.style.shadowFill
        },
        set: function(a) {
            a !== this.style.shadowFill && (this.style.shadowFill = a,
            this.dirty = !0)
        }
    }),
    Object.defineProperty(c.Text.prototype, "width", {
        get: function() {
            return this.dirty && (this.updateText(),
            this.dirty = !1),
            this.scale.x * this.texture.frame.width
        },
        set: function(a) {
            this.scale.x = a / this.texture.frame.width,
            this._width = a
        }
    }),
    Object.defineProperty(c.Text.prototype, "height", {
        get: function() {
            return this.dirty && (this.updateText(),
            this.dirty = !1),
            this.scale.y * this.texture.frame.height
        },
        set: function(a) {
            this.scale.y = a / this.texture.frame.height,
            this._height = a
        }
    }),
    c.Text.fontPropertiesCache = {},
    c.Text.fontPropertiesCanvas = PIXI.CanvasPool.create(c.Text.fontPropertiesCanvas),
    c.Text.fontPropertiesContext = c.Text.fontPropertiesCanvas.getContext("2d"),
    c.BitmapText = function(a, b, d, e, f, g, h) {
        b = b || 0,
        d = d || 0,
        e = e || "",
        f = f || "",
        g = g || 32,
        h = h || "left",
        PIXI.DisplayObjectContainer.call(this),
        this.type = c.BITMAPTEXT,
        this.physicsType = c.SPRITE,
        this.textWidth = 0,
        this.textHeight = 0,
        this.anchor = new c.Point,
        this._prevAnchor = new c.Point,
        this._glyphs = [],
        this._maxWidth = 0,
        this._text = f,
        this._data = a.cache.getBitmapFont(e),
        this._font = e,
        this._fontSize = g,
        this._align = h,
        this._tint = 16777215,
        this.updateText(),
        this.dirty = !1,
        c.Component.Core.init.call(this, a, b, d, "", null)
    }
    ,
    c.BitmapText.prototype = Object.create(PIXI.DisplayObjectContainer.prototype),
    c.BitmapText.prototype.constructor = c.BitmapText,
    c.Component.Core.install.call(c.BitmapText.prototype, ["Angle", "AutoCull", "Bounds", "Destroy", "FixedToCamera", "InputEnabled", "InWorld", "LifeSpan", "PhysicsBody", "Reset"]),
    c.BitmapText.prototype.preUpdatePhysics = c.Component.PhysicsBody.preUpdate,
    c.BitmapText.prototype.preUpdateLifeSpan = c.Component.LifeSpan.preUpdate,
    c.BitmapText.prototype.preUpdateInWorld = c.Component.InWorld.preUpdate,
    c.BitmapText.prototype.preUpdateCore = c.Component.Core.preUpdate,
    c.BitmapText.prototype.preUpdate = function() {
        return this.preUpdatePhysics() && this.preUpdateLifeSpan() && this.preUpdateInWorld() ? this.preUpdateCore() : !1
    }
    ,
    c.BitmapText.prototype.postUpdate = function() {
        c.Component.PhysicsBody.postUpdate.call(this),
        c.Component.FixedToCamera.postUpdate.call(this),
        this.body && this.body.type === c.Physics.ARCADE && (this.textWidth !== this.body.sourceWidth || this.textHeight !== this.body.sourceHeight) && this.body.setSize(this.textWidth, this.textHeight)
    }
    ,
    c.BitmapText.prototype.setText = function(a) {
        this.text = a
    }
    ,
    c.BitmapText.prototype.scanLine = function(a, b, c) {
        for (var d = 0, e = 0, f = -1, g = null, h = this._maxWidth > 0 ? this._maxWidth : null, i = [], j = 0; j < c.length; j++) {
            var k = j === c.length - 1 ? !0 : !1;
            if (/(?:\r\n|\r|\n)/.test(c.charAt(j)))
                return {
                    width: e,
                    text: c.substr(0, j),
                    end: k,
                    chars: i
                };
            var l = c.charCodeAt(j)
              , m = a.chars[l]
              , n = 0;
            if (m) {
                var o = g && m.kerning[g] ? m.kerning[g] : 0;
                if (f = /(\s)/.test(c.charAt(j)) ? j : f,
                n = (o + m.texture.width + m.xOffset) * b,
                h && e + n >= h && f > -1)
                    return {
                        width: e,
                        text: c.substr(0, j - (j - f)),
                        end: k,
                        chars: i
                    };
                e += m.xAdvance * b,
                i.push(d + m.xOffset * b),
                d += m.xAdvance * b,
                g = l
            }
        }
        return {
            width: e,
            text: c,
            end: k,
            chars: i
        }
    }
    ,
    c.BitmapText.prototype.updateText = function() {
        var a = this._data.font;
        if (a) {
            var b = this.text
              , c = this._fontSize / a.size
              , d = []
              , e = 0;
            this.textWidth = 0;
            do {
                var f = this.scanLine(a, c, b);
                f.y = e,
                d.push(f),
                f.width > this.textWidth && (this.textWidth = f.width),
                e += a.lineHeight * c,
                b = b.substr(f.text.length + 1)
            } while (f.end === !1);
            this.textHeight = e;
            for (var g = 0, h = 0, i = this.textWidth * this.anchor.x, j = this.textHeight * this.anchor.y, k = 0; k < d.length; k++) {
                var f = d[k];
                "right" === this._align ? h = this.textWidth - f.width : "center" === this._align && (h = (this.textWidth - f.width) / 2);
                for (var l = 0; l < f.text.length; l++) {
                    var m = f.text.charCodeAt(l)
                      , n = a.chars[m]
                      , o = this._glyphs[g];
                    o ? o.texture = n.texture : (o = new PIXI.Sprite(n.texture),
                    o.name = f.text[l],
                    this._glyphs.push(o)),
                    o.position.x = f.chars[l] + h - i,
                    o.position.y = f.y + n.yOffset * c - j,
                    o.scale.set(c),
                    o.tint = this.tint,
                    o.texture.requiresReTint = !0,
                    o.parent || this.addChild(o),
                    g++
                }
            }
            for (k = g; k < this._glyphs.length; k++)
                this.removeChild(this._glyphs[k])
        }
    }
    ,
    c.BitmapText.prototype.purgeGlyphs = function() {
        for (var a = this._glyphs.length, b = [], c = 0; c < this._glyphs.length; c++)
            this._glyphs[c].parent !== this ? this._glyphs[c].destroy() : b.push(this._glyphs[c]);
        return this._glyphs = [],
        this._glyphs = b,
        this.updateText(),
        a - b.length
    }
    ,
    c.BitmapText.prototype.updateTransform = function() {
        (this.dirty || !this.anchor.equals(this._prevAnchor)) && (this.updateText(),
        this.dirty = !1,
        this._prevAnchor.copyFrom(this.anchor)),
        PIXI.DisplayObjectContainer.prototype.updateTransform.call(this)
    }
    ,
    Object.defineProperty(c.BitmapText.prototype, "align", {
        get: function() {
            return this._align
        },
        set: function(a) {
            a === this._align || "left" !== a && "center" !== a && "right" !== a || (this._align = a,
            this.updateText())
        }
    }),
    Object.defineProperty(c.BitmapText.prototype, "tint", {
        get: function() {
            return this._tint
        },
        set: function(a) {
            a !== this._tint && (this._tint = a,
            this.updateText())
        }
    }),
    Object.defineProperty(c.BitmapText.prototype, "font", {
        get: function() {
            return this._font
        },
        set: function(a) {
            a !== this._font && (this._font = a.trim(),
            this._data = this.game.cache.getBitmapFont(this._font),
            this.updateText())
        }
    }),
    Object.defineProperty(c.BitmapText.prototype, "fontSize", {
        get: function() {
            return this._fontSize
        },
        set: function(a) {
            a = parseInt(a, 10),
            a !== this._fontSize && a > 0 && (this._fontSize = a,
            this.updateText())
        }
    }),
    Object.defineProperty(c.BitmapText.prototype, "text", {
        get: function() {
            return this._text
        },
        set: function(a) {
            a !== this._text && (this._text = a.toString() || "",
            this.updateText())
        }
    }),
    Object.defineProperty(c.BitmapText.prototype, "maxWidth", {
        get: function() {
            return this._maxWidth
        },
        set: function(a) {
            a !== this._maxWidth && (this._maxWidth = a,
            this.updateText())
        }
    }),
    Object.defineProperty(c.BitmapText.prototype, "smoothed", {
        get: function() {
            return !this._data.base.scaleMode
        },
        set: function(a) {
            this._data.base.scaleMode = a ? 0 : 1
        }
    }),
    c.RetroFont = function(a, b, d, e, f, g, h, i, j, k) {
        if (!a.cache.checkImageKey(b))
            return !1;
        (void 0 === g || null === g) && (g = a.cache.getImage(b).width / d),
        this.characterWidth = d,
        this.characterHeight = e,
        this.characterSpacingX = h || 0,
        this.characterSpacingY = i || 0,
        this.characterPerRow = g,
        this.offsetX = j || 0,
        this.offsetY = k || 0,
        this.align = "left",
        this.multiLine = !1,
        this.autoUpperCase = !0,
        this.customSpacingX = 0,
        this.customSpacingY = 0,
        this.fixedWidth = 0,
        this.fontSet = a.cache.getImage(b),
        this._text = "",
        this.grabData = [],
        this.frameData = new c.FrameData;
        for (var l = this.offsetX, m = this.offsetY, n = 0, o = 0; o < f.length; o++) {
            var p = this.frameData.addFrame(new c.Frame(o,l,m,this.characterWidth,this.characterHeight));
            this.grabData[f.charCodeAt(o)] = p.index,
            n++,
            n === this.characterPerRow ? (n = 0,
            l = this.offsetX,
            m += this.characterHeight + this.characterSpacingY) : l += this.characterWidth + this.characterSpacingX
        }
        a.cache.updateFrameData(b, this.frameData),
        this.stamp = new c.Image(a,0,0,b,0),
        c.RenderTexture.call(this, a, 100, 100, "", c.scaleModes.NEAREST),
        this.type = c.RETROFONT
    }
    ,
    c.RetroFont.prototype = Object.create(c.RenderTexture.prototype),
    c.RetroFont.prototype.constructor = c.RetroFont,
    c.RetroFont.ALIGN_LEFT = "left",
    c.RetroFont.ALIGN_RIGHT = "right",
    c.RetroFont.ALIGN_CENTER = "center",
    c.RetroFont.TEXT_SET1 = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
    c.RetroFont.TEXT_SET2 = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    c.RetroFont.TEXT_SET3 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ",
    c.RetroFont.TEXT_SET4 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789",
    c.RetroFont.TEXT_SET5 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ.,/() '!?-*:0123456789",
    c.RetroFont.TEXT_SET6 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!?:;0123456789\"(),-.' ",
    c.RetroFont.TEXT_SET7 = "AGMSY+:4BHNTZ!;5CIOU.?06DJPV,(17EKQW\")28FLRX-'39",
    c.RetroFont.TEXT_SET8 = "0123456789 .ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    c.RetroFont.TEXT_SET9 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ()-0123456789.:,'\"?!",
    c.RetroFont.TEXT_SET10 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    c.RetroFont.TEXT_SET11 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ.,\"-+!?()':;0123456789",
    c.RetroFont.prototype.setFixedWidth = function(a, b) {
        void 0 === b && (b = "left"),
        this.fixedWidth = a,
        this.align = b
    }
    ,
    c.RetroFont.prototype.setText = function(a, b, c, d, e, f) {
        this.multiLine = b || !1,
        this.customSpacingX = c || 0,
        this.customSpacingY = d || 0,
        this.align = e || "left",
        this.autoUpperCase = f ? !1 : !0,
        a.length > 0 && (this.text = a)
    }
    ,
    c.RetroFont.prototype.buildRetroFontText = function() {
        var a = 0
          , b = 0;
        if (this.clear(),
        this.multiLine) {
            var d = this._text.split("\n");
            this.fixedWidth > 0 ? this.resize(this.fixedWidth, d.length * (this.characterHeight + this.customSpacingY) - this.customSpacingY, !0) : this.resize(this.getLongestLine() * (this.characterWidth + this.customSpacingX), d.length * (this.characterHeight + this.customSpacingY) - this.customSpacingY, !0);
            for (var e = 0; e < d.length; e++)
                a = 0,
                this.align === c.RetroFont.ALIGN_RIGHT ? a = this.width - d[e].length * (this.characterWidth + this.customSpacingX) : this.align === c.RetroFont.ALIGN_CENTER && (a = this.width / 2 - d[e].length * (this.characterWidth + this.customSpacingX) / 2,
                a += this.customSpacingX / 2),
                0 > a && (a = 0),
                this.pasteLine(d[e], a, b, this.customSpacingX),
                b += this.characterHeight + this.customSpacingY
        } else
            this.fixedWidth > 0 ? this.resize(this.fixedWidth, this.characterHeight, !0) : this.resize(this._text.length * (this.characterWidth + this.customSpacingX), this.characterHeight, !0),
            a = 0,
            this.align === c.RetroFont.ALIGN_RIGHT ? a = this.width - this._text.length * (this.characterWidth + this.customSpacingX) : this.align === c.RetroFont.ALIGN_CENTER && (a = this.width / 2 - this._text.length * (this.characterWidth + this.customSpacingX) / 2,
            a += this.customSpacingX / 2),
            0 > a && (a = 0),
            this.pasteLine(this._text, a, 0, this.customSpacingX);
        this.requiresReTint = !0
    }
    ,
    c.RetroFont.prototype.pasteLine = function(a, b, c, d) {
        for (var e = 0; e < a.length; e++)
            if (" " === a.charAt(e))
                b += this.characterWidth + d;
            else if (this.grabData[a.charCodeAt(e)] >= 0 && (this.stamp.frame = this.grabData[a.charCodeAt(e)],
            this.renderXY(this.stamp, b, c, !1),
            b += this.characterWidth + d,
            b > this.width))
                break
    }
    ,
    c.RetroFont.prototype.getLongestLine = function() {
        var a = 0;
        if (this._text.length > 0)
            for (var b = this._text.split("\n"), c = 0; c < b.length; c++)
                b[c].length > a && (a = b[c].length);
        return a
    }
    ,
    c.RetroFont.prototype.removeUnsupportedCharacters = function(a) {
        for (var b = "", c = 0; c < this._text.length; c++) {
            var d = this._text[c]
              , e = d.charCodeAt(0);
            (this.grabData[e] >= 0 || !a && "\n" === d) && (b = b.concat(d))
        }
        return b
    }
    ,
    c.RetroFont.prototype.updateOffset = function(a, b) {
        if (this.offsetX !== a || this.offsetY !== b) {
            for (var c = a - this.offsetX, d = b - this.offsetY, e = this.game.cache.getFrameData(this.stamp.key).getFrames(), f = e.length; f--; )
                e[f].x += c,
                e[f].y += d;
            this.buildRetroFontText()
        }
    }
    ,
    Object.defineProperty(c.RetroFont.prototype, "text", {
        get: function() {
            return this._text
        },
        set: function(a) {
            var b;
            b = this.autoUpperCase ? a.toUpperCase() : a,
            b !== this._text && (this._text = b,
            this.removeUnsupportedCharacters(this.multiLine),
            this.buildRetroFontText())
        }
    }),
    Object.defineProperty(c.RetroFont.prototype, "smoothed", {
        get: function() {
            return this.stamp.smoothed
        },
        set: function(a) {
            this.stamp.smoothed = a,
            this.buildRetroFontText()
        }
    }),
    c.Rope = function(a, b, d, e, f, g) {
        this.points = [],
        this.points = g,
        this._hasUpdateAnimation = !1,
        this._updateAnimationCallback = null,
        b = b || 0,
        d = d || 0,
        e = e || null,
        f = f || null,
        this.type = c.ROPE,
        this._scroll = new c.Point,
        PIXI.Rope.call(this, PIXI.TextureCache.__default, this.points),
        c.Component.Core.init.call(this, a, b, d, e, f)
    }
    ,
    c.Rope.prototype = Object.create(PIXI.Rope.prototype),
    c.Rope.prototype.constructor = c.Rope,
    c.Component.Core.install.call(c.Rope.prototype, ["Angle", "Animation", "AutoCull", "Bounds", "BringToTop", "Crop", "Delta", "Destroy", "FixedToCamera", "InputEnabled", "InWorld", "LifeSpan", "LoadTexture", "Overlap", "PhysicsBody", "Reset", "ScaleMinMax", "Smoothed"]),
    c.Rope.prototype.preUpdatePhysics = c.Component.PhysicsBody.preUpdate,
    c.Rope.prototype.preUpdateLifeSpan = c.Component.LifeSpan.preUpdate,
    c.Rope.prototype.preUpdateInWorld = c.Component.InWorld.preUpdate,
    c.Rope.prototype.preUpdateCore = c.Component.Core.preUpdate,
    c.Rope.prototype.preUpdate = function() {
        return 0 !== this._scroll.x && (this.tilePosition.x += this._scroll.x * this.game.time.physicsElapsed),
        0 !== this._scroll.y && (this.tilePosition.y += this._scroll.y * this.game.time.physicsElapsed),
        this.preUpdatePhysics() && this.preUpdateLifeSpan() && this.preUpdateInWorld() ? this.preUpdateCore() : !1
    }
    ,
    c.Rope.prototype.update = function() {
        this._hasUpdateAnimation && this.updateAnimation.call(this)
    }
    ,
    c.Rope.prototype.reset = function(a, b) {
        return c.Component.Reset.prototype.reset.call(this, a, b),
        this.tilePosition.x = 0,
        this.tilePosition.y = 0,
        this
    }
    ,
    Object.defineProperty(c.Rope.prototype, "updateAnimation", {
        get: function() {
            return this._updateAnimation
        },
        set: function(a) {
            a && "function" == typeof a ? (this._hasUpdateAnimation = !0,
            this._updateAnimation = a) : (this._hasUpdateAnimation = !1,
            this._updateAnimation = null)
        }
    }),
    Object.defineProperty(c.Rope.prototype, "segments", {
        get: function() {
            for (var a, b, d, e, f, g, h, i, j = [], k = 0; k < this.points.length; k++)
                a = 4 * k,
                b = this.vertices[a] * this.scale.x,
                d = this.vertices[a + 1] * this.scale.y,
                e = this.vertices[a + 4] * this.scale.x,
                f = this.vertices[a + 3] * this.scale.y,
                g = c.Math.difference(b, e),
                h = c.Math.difference(d, f),
                b += this.world.x,
                d += this.world.y,
                i = new c.Rectangle(b,d,g,h),
                j.push(i);
            return j
        }
    }),
    c.TileSprite = function(a, b, d, e, f, g, h) {
        b = b || 0,
        d = d || 0,
        e = e || 256,
        f = f || 256,
        g = g || null,
        h = h || null,
        this.type = c.TILESPRITE,
        this.physicsType = c.SPRITE,
        this._scroll = new c.Point;
        var i = a.cache.getImage("__default", !0);
        PIXI.TilingSprite.call(this, new PIXI.Texture(i.base), e, f),
        c.Component.Core.init.call(this, a, b, d, g, h)
    }
    ,
    c.TileSprite.prototype = Object.create(PIXI.TilingSprite.prototype),
    c.TileSprite.prototype.constructor = c.TileSprite,
    c.Component.Core.install.call(c.TileSprite.prototype, ["Angle", "Animation", "AutoCull", "Bounds", "BringToTop", "Destroy", "FixedToCamera", "Health", "InCamera", "InputEnabled", "InWorld", "LifeSpan", "LoadTexture", "Overlap", "PhysicsBody", "Reset", "Smoothed"]),
    c.TileSprite.prototype.preUpdatePhysics = c.Component.PhysicsBody.preUpdate,
    c.TileSprite.prototype.preUpdateLifeSpan = c.Component.LifeSpan.preUpdate,
    c.TileSprite.prototype.preUpdateInWorld = c.Component.InWorld.preUpdate,
    c.TileSprite.prototype.preUpdateCore = c.Component.Core.preUpdate,
    c.TileSprite.prototype.preUpdate = function() {
        return 0 !== this._scroll.x && (this.tilePosition.x += this._scroll.x * this.game.time.physicsElapsed),
        0 !== this._scroll.y && (this.tilePosition.y += this._scroll.y * this.game.time.physicsElapsed),
        this.preUpdatePhysics() && this.preUpdateLifeSpan() && this.preUpdateInWorld() ? this.preUpdateCore() : !1
    }
    ,
    c.TileSprite.prototype.autoScroll = function(a, b) {
        this._scroll.set(a, b)
    }
    ,
    c.TileSprite.prototype.stopScroll = function() {
        this._scroll.set(0, 0)
    }
    ,
    c.TileSprite.prototype.destroy = function(a) {
        c.Component.Destroy.prototype.destroy.call(this, a),
        PIXI.TilingSprite.prototype.destroy.call(this)
    }
    ,
    c.TileSprite.prototype.reset = function(a, b) {
        return c.Component.Reset.prototype.reset.call(this, a, b),
        this.tilePosition.x = 0,
        this.tilePosition.y = 0,
        this
    }
    ,
    c.Device = function() {
        this.deviceReadyAt = 0,
        this.initialized = !1,
        this.desktop = !1,
        this.iOS = !1,
        this.cocoonJS = !1,
        this.cocoonJSApp = !1,
        this.cordova = !1,
        this.node = !1,
        this.nodeWebkit = !1,
        this.electron = !1,
        this.ejecta = !1,
        this.crosswalk = !1,
        this.android = !1,
        this.chromeOS = !1,
        this.linux = !1,
        this.macOS = !1,
        this.windows = !1,
        this.windowsPhone = !1,
        this.canvas = !1,
        this.canvasBitBltShift = null,
        this.webGL = !1,
        this.file = !1,
        this.fileSystem = !1,
        this.localStorage = !1,
        this.worker = !1,
        this.css3D = !1,
        this.pointerLock = !1,
        this.typedArray = !1,
        this.vibration = !1,
        this.getUserMedia = !0,
        this.quirksMode = !1,
        this.touch = !1,
        this.mspointer = !1,
        this.wheelEvent = null,
        this.arora = !1,
        this.chrome = !1,
        this.chromeVersion = 0,
        this.epiphany = !1,
        this.firefox = !1,
        this.firefoxVersion = 0,
        this.ie = !1,
        this.ieVersion = 0,
        this.trident = !1,
        this.tridentVersion = 0,
        this.mobileSafari = !1,
        this.midori = !1,
        this.opera = !1,
        this.safari = !1,
        this.webApp = !1,
        this.silk = !1,
        this.audioData = !1,
        this.webAudio = !1,
        this.ogg = !1,
        this.opus = !1,
        this.mp3 = !1,
        this.wav = !1,
        this.m4a = !1,
        this.webm = !1,
        this.oggVideo = !1,
        this.h264Video = !1,
        this.mp4Video = !1,
        this.webmVideo = !1,
        this.vp9Video = !1,
        this.hlsVideo = !1,
        this.iPhone = !1,
        this.iPhone4 = !1,
        this.iPad = !1,
        this.pixelRatio = 0,
        this.littleEndian = !1,
        this.LITTLE_ENDIAN = !1,
        this.support32bit = !1,
        this.fullscreen = !1,
        this.requestFullscreen = "",
        this.cancelFullscreen = "",
        this.fullscreenKeyboard = !1
    }
    ,
    c.Device = new c.Device,
    c.Device.onInitialized = new c.Signal,
    c.Device.whenReady = function(a, b, c) {
        var d = this._readyCheck;
        if (this.deviceReadyAt || !d)
            a.call(b, this);
        else if (d._monitor || c)
            d._queue = d._queue || [],
            d._queue.push([a, b]);
        else {
            d._monitor = d.bind(this),
            d._queue = d._queue || [],
            d._queue.push([a, b]);
            var e = "undefined" != typeof window.cordova
              , f = navigator.isCocoonJS;
            "complete" === document.readyState || "interactive" === document.readyState ? window.setTimeout(d._monitor, 0) : e && !f ? document.addEventListener("deviceready", d._monitor, !1) : (document.addEventListener("DOMContentLoaded", d._monitor, !1),
            window.addEventListener("load", d._monitor, !1))
        }
    }
    ,
    c.Device._readyCheck = function() {
        var a = this._readyCheck;
        if (document.body) {
            if (!this.deviceReadyAt) {
                this.deviceReadyAt = Date.now(),
                document.removeEventListener("deviceready", a._monitor),
                document.removeEventListener("DOMContentLoaded", a._monitor),
                window.removeEventListener("load", a._monitor),
                this._initialize(),
                this.initialized = !0,
                this.onInitialized.dispatch(this);
                for (var b; b = a._queue.shift(); ) {
                    var c = b[0]
                      , d = b[1];
                    c.call(d, this)
                }
                this._readyCheck = null,
                this._initialize = null,
                this.onInitialized = null
            }
        } else
            window.setTimeout(a._monitor, 20)
    }
    ,
    c.Device._initialize = function() {
        function a() {
            var a = navigator.userAgent;
            /Playstation Vita/.test(a) ? l.vita = !0 : /Kindle/.test(a) || /\bKF[A-Z][A-Z]+/.test(a) || /Silk.*Mobile Safari/.test(a) ? l.kindle = !0 : /Android/.test(a) ? l.android = !0 : /CrOS/.test(a) ? l.chromeOS = !0 : /iP[ao]d|iPhone/i.test(a) ? l.iOS = !0 : /Linux/.test(a) ? l.linux = !0 : /Mac OS/.test(a) ? l.macOS = !0 : /Windows/.test(a) && (l.windows = !0),
            (/Windows Phone/i.test(a) || /IEMobile/i.test(a)) && (l.android = !1,
            l.iOS = !1,
            l.macOS = !1,
            l.windows = !0,
            l.windowsPhone = !0);
            var b = /Silk/.test(a);
            (l.windows || l.macOS || l.linux && !b || l.chromeOS) && (l.desktop = !0),
            (l.windowsPhone || /Windows NT/i.test(a) && /Touch/i.test(a)) && (l.desktop = !1)
        }
        function b() {
            l.canvas = !!window.CanvasRenderingContext2D || l.cocoonJS;
            try {
                l.localStorage = !!localStorage.getItem
            } catch (a) {
                l.localStorage = !1
            }
            l.file = !!(window.File && window.FileReader && window.FileList && window.Blob),
            l.fileSystem = !!window.requestFileSystem,
            l.webGL = function() {
                try {
                    var a = document.createElement("canvas");
                    return a.screencanvas = !1,
                    !!window.WebGLRenderingContext && (a.getContext("webgl") || a.getContext("experimental-webgl"))
                } catch (b) {
                    return !1
                }
            }(),
            l.webGL = !!l.webGL,
            l.worker = !!window.Worker,
            l.pointerLock = "pointerLockElement"in document || "mozPointerLockElement"in document || "webkitPointerLockElement"in document,
            l.quirksMode = "CSS1Compat" === document.compatMode ? !1 : !0,
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia,
            window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL,
            l.getUserMedia = l.getUserMedia && !!navigator.getUserMedia && !!window.URL,
            l.firefox && l.firefoxVersion < 21 && (l.getUserMedia = !1),
            !l.iOS && (l.ie || l.firefox || l.chrome) && (l.canvasBitBltShift = !0),
            (l.safari || l.mobileSafari) && (l.canvasBitBltShift = !1)
        }
        function c() {
            ("ontouchstart"in document.documentElement || window.navigator.maxTouchPoints && window.navigator.maxTouchPoints >= 1) && (l.touch = !0),
            (window.navigator.msPointerEnabled || window.navigator.pointerEnabled) && (l.mspointer = !0),
            l.cocoonJS || ("onwheel"in window || l.ie && "WheelEvent"in window ? l.wheelEvent = "wheel" : "onmousewheel"in window ? l.wheelEvent = "mousewheel" : l.firefox && "MouseScrollEvent"in window && (l.wheelEvent = "DOMMouseScroll"))
        }
        function d() {
            for (var a = ["requestFullscreen", "requestFullScreen", "webkitRequestFullscreen", "webkitRequestFullScreen", "msRequestFullscreen", "msRequestFullScreen", "mozRequestFullScreen", "mozRequestFullscreen"], b = document.createElement("div"), c = 0; c < a.length; c++)
                if (b[a[c]]) {
                    l.fullscreen = !0,
                    l.requestFullscreen = a[c];
                    break
                }
            var d = ["cancelFullScreen", "exitFullscreen", "webkitCancelFullScreen", "webkitExitFullscreen", "msCancelFullScreen", "msExitFullscreen", "mozCancelFullScreen", "mozExitFullscreen"];
            if (l.fullscreen)
                for (var c = 0; c < d.length; c++)
                    if (document[d[c]]) {
                        l.cancelFullscreen = d[c];
                        break
                    }
            window.Element && Element.ALLOW_KEYBOARD_INPUT && (l.fullscreenKeyboard = !0)
        }
        function e() {
            var a = navigator.userAgent;
            if (/Arora/.test(a) ? l.arora = !0 : /Chrome\/(\d+)/.test(a) && !l.windowsPhone ? (l.chrome = !0,
            l.chromeVersion = parseInt(RegExp.$1, 10)) : /Epiphany/.test(a) ? l.epiphany = !0 : /Firefox\D+(\d+)/.test(a) ? (l.firefox = !0,
            l.firefoxVersion = parseInt(RegExp.$1, 10)) : /AppleWebKit/.test(a) && l.iOS ? l.mobileSafari = !0 : /MSIE (\d+\.\d+);/.test(a) ? (l.ie = !0,
            l.ieVersion = parseInt(RegExp.$1, 10)) : /Midori/.test(a) ? l.midori = !0 : /Opera/.test(a) ? l.opera = !0 : /Safari/.test(a) && !l.windowsPhone ? l.safari = !0 : /Trident\/(\d+\.\d+)(.*)rv:(\d+\.\d+)/.test(a) && (l.ie = !0,
            l.trident = !0,
            l.tridentVersion = parseInt(RegExp.$1, 10),
            l.ieVersion = parseInt(RegExp.$3, 10)),
            /Silk/.test(a) && (l.silk = !0),
            navigator.standalone && (l.webApp = !0),
            "undefined" != typeof window.cordova && (l.cordova = !0),
            "undefined" != typeof process && "undefined" != typeof require && (l.node = !0),
            l.node && "object" == typeof process.versions && (l.nodeWebkit = !!process.versions["node-webkit"],
            l.electron = !!process.versions.electron),
            navigator.isCocoonJS && (l.cocoonJS = !0),
            l.cocoonJS)
                try {
                    l.cocoonJSApp = "undefined" != typeof CocoonJS
                } catch (b) {
                    l.cocoonJSApp = !1
                }
            "undefined" != typeof window.ejecta && (l.ejecta = !0),
            /Crosswalk/.test(a) && (l.crosswalk = !0)
        }
        function f() {
            var a = document.createElement("video")
              , b = !1;
            try {
                (b = !!a.canPlayType) && (a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, "") && (l.oggVideo = !0),
                a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, "") && (l.h264Video = !0,
                l.mp4Video = !0),
                a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, "") && (l.webmVideo = !0),
                a.canPlayType('video/webm; codecs="vp9"').replace(/^no$/, "") && (l.vp9Video = !0),
                a.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/, "") && (l.hlsVideo = !0))
            } catch (c) {}
        }
        function g() {
            l.audioData = !!window.Audio,
            l.webAudio = !(!window.AudioContext && !window.webkitAudioContext);
            var a = document.createElement("audio")
              , b = !1;
            try {
                (b = !!a.canPlayType) && (a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, "") && (l.ogg = !0),
                (a.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, "") || a.canPlayType("audio/opus;").replace(/^no$/, "")) && (l.opus = !0),
                a.canPlayType("audio/mpeg;").replace(/^no$/, "") && (l.mp3 = !0),
                a.canPlayType('audio/wav; codecs="1"').replace(/^no$/, "") && (l.wav = !0),
                (a.canPlayType("audio/x-m4a;") || a.canPlayType("audio/aac;").replace(/^no$/, "")) && (l.m4a = !0),
                a.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "") && (l.webm = !0))
            } catch (c) {}
        }
        function h() {
            l.pixelRatio = window.devicePixelRatio || 1,
            l.iPhone = -1 != navigator.userAgent.toLowerCase().indexOf("iphone"),
            l.iPhone4 = 2 == l.pixelRatio && l.iPhone,
            l.iPad = -1 != navigator.userAgent.toLowerCase().indexOf("ipad"),
            l.typedArray = "undefined" != typeof Int8Array ? !0 : !1,
            "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array && "undefined" != typeof Uint32Array && (l.littleEndian = i(),
            l.LITTLE_ENDIAN = l.littleEndian),
            l.support32bit = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8ClampedArray && "undefined" != typeof Int32Array && null !== l.littleEndian && j(),
            navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate,
            navigator.vibrate && (l.vibration = !0)
        }
        function i() {
            var a = new ArrayBuffer(4)
              , b = new Uint8Array(a)
              , c = new Uint32Array(a);
            return b[0] = 161,
            b[1] = 178,
            b[2] = 195,
            b[3] = 212,
            3569595041 == c[0] ? !0 : 2712847316 == c[0] ? !1 : null
        }
        function j() {
            if (void 0 === Uint8ClampedArray)
                return !1;
            var a = PIXI.CanvasPool.create(this, 1, 1)
              , b = a.getContext("2d");
            if (!b)
                return !1;
            var c = b.createImageData(1, 1);
            return PIXI.CanvasPool.remove(this),
            c.data instanceof Uint8ClampedArray
        }
        function k() {
            var a, b = document.createElement("p"), c = {
                webkitTransform: "-webkit-transform",
                OTransform: "-o-transform",
                msTransform: "-ms-transform",
                MozTransform: "-moz-transform",
                transform: "transform"
            };
            document.body.insertBefore(b, null);
            for (var d in c)
                void 0 !== b.style[d] && (b.style[d] = "translate3d(1px,1px,1px)",
                a = window.getComputedStyle(b).getPropertyValue(c[d]));
            document.body.removeChild(b),
            l.css3D = void 0 !== a && a.length > 0 && "none" !== a
        }
        var l = this;
        a(),
        g(),
        f(),
        e(),
        k(),
        h(),
        b(),
        d(),
        c()
    }
    ,
    c.Device.canPlayAudio = function(a) {
        return "mp3" === a && this.mp3 ? !0 : "ogg" === a && (this.ogg || this.opus) ? !0 : "m4a" === a && this.m4a ? !0 : "opus" === a && this.opus ? !0 : "wav" === a && this.wav ? !0 : "webm" === a && this.webm ? !0 : !1
    }
    ,
    c.Device.canPlayVideo = function(a) {
        return "webm" === a && (this.webmVideo || this.vp9Video) ? !0 : "mp4" === a && (this.mp4Video || this.h264Video) ? !0 : "ogg" !== a && "ogv" !== a || !this.oggVideo ? "mpeg" === a && this.hlsVideo ? !0 : !1 : !0
    }
    ,
    c.Device.isConsoleOpen = function() {
        return window.console && window.console.firebug ? !0 : window.console && (console.profile(),
        console.profileEnd(),
        console.clear && console.clear(),
        console.profiles) ? console.profiles.length > 0 : !1
    }
    ,
    c.Device.isAndroidStockBrowser = function() {
        var a = window.navigator.userAgent.match(/Android.*AppleWebKit\/([\d.]+)/);
        return a && a[1] < 537
    }
    ,
    c.DOM = {
        getOffset: function(a, b) {
            b = b || new c.Point;
            var d = a.getBoundingClientRect()
              , e = c.DOM.scrollY
              , f = c.DOM.scrollX
              , g = document.documentElement.clientTop
              , h = document.documentElement.clientLeft;
            return b.x = d.left + f - h,
            b.y = d.top + e - g,
            b
        },
        getBounds: function(a, b) {
            return void 0 === b && (b = 0),
            a = a && !a.nodeType ? a[0] : a,
            a && 1 === a.nodeType ? this.calibrate(a.getBoundingClientRect(), b) : !1
        },
        calibrate: function(a, b) {
            b = +b || 0;
            var c = {
                width: 0,
                height: 0,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };
            return c.width = (c.right = a.right + b) - (c.left = a.left - b),
            c.height = (c.bottom = a.bottom + b) - (c.top = a.top - b),
            c
        },
        getAspectRatio: function(a) {
            a = null == a ? this.visualBounds : 1 === a.nodeType ? this.getBounds(a) : a;
            var b = a.width
              , c = a.height;
            return "function" == typeof b && (b = b.call(a)),
            "function" == typeof c && (c = c.call(a)),
            b / c
        },
        inLayoutViewport: function(a, b) {
            var c = this.getBounds(a, b);
            return !!c && c.bottom >= 0 && c.right >= 0 && c.top <= this.layoutBounds.width && c.left <= this.layoutBounds.height
        },
        getScreenOrientation: function(a) {
            var b = window.screen
              , c = b.orientation || b.mozOrientation || b.msOrientation;
            if (c && "string" == typeof c.type)
                return c.type;
            if ("string" == typeof c)
                return c;
            var d = "portrait-primary"
              , e = "landscape-primary";
            if ("screen" === a)
                return b.height > b.width ? d : e;
            if ("viewport" === a)
                return this.visualBounds.height > this.visualBounds.width ? d : e;
            if ("window.orientation" === a && "number" == typeof window.orientation)
                return 0 === window.orientation || 180 === window.orientation ? d : e;
            if (window.matchMedia) {
                if (window.matchMedia("(orientation: portrait)").matches)
                    return d;
                if (window.matchMedia("(orientation: landscape)").matches)
                    return e
            }
            return this.visualBounds.height > this.visualBounds.width ? d : e
        },
        visualBounds: new c.Rectangle,
        layoutBounds: new c.Rectangle,
        documentBounds: new c.Rectangle
    },
    c.Device.whenReady(function(a) {
        var b = window && "pageXOffset"in window ? function() {
            return window.pageXOffset
        }
        : function() {
            return document.documentElement.scrollLeft
        }
          , d = window && "pageYOffset"in window ? function() {
            return window.pageYOffset
        }
        : function() {
            return document.documentElement.scrollTop
        }
        ;
        Object.defineProperty(c.DOM, "scrollX", {
            get: b
        }),
        Object.defineProperty(c.DOM, "scrollY", {
            get: d
        }),
        Object.defineProperty(c.DOM.visualBounds, "x", {
            get: b
        }),
        Object.defineProperty(c.DOM.visualBounds, "y", {
            get: d
        }),
        Object.defineProperty(c.DOM.layoutBounds, "x", {
            value: 0
        }),
        Object.defineProperty(c.DOM.layoutBounds, "y", {
            value: 0
        });
        var e = a.desktop && document.documentElement.clientWidth <= window.innerWidth && document.documentElement.clientHeight <= window.innerHeight;
        if (e) {
            var f = function() {
                return Math.max(window.innerWidth, document.documentElement.clientWidth)
            }
              , g = function() {
                return Math.max(window.innerHeight, document.documentElement.clientHeight)
            };
            Object.defineProperty(c.DOM.visualBounds, "width", {
                get: f
            }),
            Object.defineProperty(c.DOM.visualBounds, "height", {
                get: g
            }),
            Object.defineProperty(c.DOM.layoutBounds, "width", {
                get: f
            }),
            Object.defineProperty(c.DOM.layoutBounds, "height", {
                get: g
            })
        } else
            Object.defineProperty(c.DOM.visualBounds, "width", {
                get: function() {
                    return window.innerWidth
                }
            }),
            Object.defineProperty(c.DOM.visualBounds, "height", {
                get: function() {
                    return window.innerHeight
                }
            }),
            Object.defineProperty(c.DOM.layoutBounds, "width", {
                get: function() {
                    var a = document.documentElement.clientWidth
                      , b = window.innerWidth;
                    return b > a ? b : a
                }
            }),
            Object.defineProperty(c.DOM.layoutBounds, "height", {
                get: function() {
                    var a = document.documentElement.clientHeight
                      , b = window.innerHeight;
                    return b > a ? b : a
                }
            });
        Object.defineProperty(c.DOM.documentBounds, "x", {
            value: 0
        }),
        Object.defineProperty(c.DOM.documentBounds, "y", {
            value: 0
        }),
        Object.defineProperty(c.DOM.documentBounds, "width", {
            get: function() {
                var a = document.documentElement;
                return Math.max(a.clientWidth, a.offsetWidth, a.scrollWidth)
            }
        }),
        Object.defineProperty(c.DOM.documentBounds, "height", {
            get: function() {
                var a = document.documentElement;
                return Math.max(a.clientHeight, a.offsetHeight, a.scrollHeight)
            }
        })
    }, null, !0),
    c.Canvas = {
        create: function(a, b, c, d, e) {
            if (b = b || 256,
            c = c || 256,
            void 0 === e)
                var f = PIXI.CanvasPool.create(a, b, c);
            else
                var f = document.createElement("canvas");
            return "string" == typeof d && "" !== d && (f.id = d),
            f.width = b,
            f.height = c,
            f.style.display = "block",
            f
        },
        setBackgroundColor: function(a, b) {
            return b = b || "rgb(0,0,0)",
            a.style.backgroundColor = b,
            a
        },
        setTouchAction: function(a, b) {
            return b = b || "none",
            a.style.msTouchAction = b,
            a.style["ms-touch-action"] = b,
            a.style["touch-action"] = b,
            a
        },
        setUserSelect: function(a, b) {
            return b = b || "none",
            a.style["-webkit-touch-callout"] = b,
            a.style["-webkit-user-select"] = b,
            a.style["-khtml-user-select"] = b,
            a.style["-moz-user-select"] = b,
            a.style["-ms-user-select"] = b,
            a.style["user-select"] = b,
            a.style["-webkit-tap-highlight-color"] = "rgba(0, 0, 0, 0)",
            a
        },
        addToDOM: function(a, b, c) {
            var d;
            return void 0 === c && (c = !0),
            b && ("string" == typeof b ? d = document.getElementById(b) : "object" == typeof b && 1 === b.nodeType && (d = b)),
            d || (d = document.body),
            c && d.style && (d.style.overflow = "hidden"),
            d.appendChild(a),
            a
        },
        removeFromDOM: function(a) {
            a.parentNode && a.parentNode.removeChild(a)
        },
        setTransform: function(a, b, c, d, e, f, g) {
            return a.setTransform(d, f, g, e, b, c),
            a
        },
        setSmoothingEnabled: function(a, b) {
            var c = ["i", "mozI", "oI", "webkitI", "msI"];
            for (var d in c) {
                var e = c[d] + "mageSmoothingEnabled";
                if (e in a)
                    return a[e] = b,
                    a
            }
            return a
        },
        getSmoothingEnabled: function(a) {
            return a.imageSmoothingEnabled || a.mozImageSmoothingEnabled || a.oImageSmoothingEnabled || a.webkitImageSmoothingEnabled || a.msImageSmoothingEnabled
        },
        setImageRenderingCrisp: function(a) {
            return a.style["image-rendering"] = "optimizeSpeed",
            a.style["image-rendering"] = "crisp-edges",
            a.style["image-rendering"] = "-moz-crisp-edges",
            a.style["image-rendering"] = "-webkit-optimize-contrast",
            a.style["image-rendering"] = "optimize-contrast",
            a.style["image-rendering"] = "pixelated",
            a.style.msInterpolationMode = "nearest-neighbor",
            a
        },
        setImageRenderingBicubic: function(a) {
            return a.style["image-rendering"] = "auto",
            a.style.msInterpolationMode = "bicubic",
            a
        }
    },
    c.RequestAnimationFrame = function(a, b) {
        void 0 === b && (b = !1),
        this.game = a,
        this.isRunning = !1,
        this.forceSetTimeOut = b;
        for (var c = ["ms", "moz", "webkit", "o"], d = 0; d < c.length && !window.requestAnimationFrame; d++)
            window.requestAnimationFrame = window[c[d] + "RequestAnimationFrame"],
            window.cancelAnimationFrame = window[c[d] + "CancelAnimationFrame"];
        this._isSetTimeOut = !1,
        this._onLoop = null,
        this._timeOutID = null
    }
    ,
    c.RequestAnimationFrame.prototype = {
        start: function() {
            this.isRunning = !0;
            var a = this;
            !window.requestAnimationFrame || this.forceSetTimeOut ? (this._isSetTimeOut = !0,
            this._onLoop = function() {
                return a.updateSetTimeout()
            }
            ,
            this._timeOutID = window.setTimeout(this._onLoop, 0)) : (this._isSetTimeOut = !1,
            this._onLoop = function(b) {
                return a.updateRAF(b)
            }
            ,
            this._timeOutID = window.requestAnimationFrame(this._onLoop))
        },
        updateRAF: function(a) {
            this.game.update(Math.floor(a)),
            this._timeOutID = window.requestAnimationFrame(this._onLoop)
        },
        updateSetTimeout: function() {
            this.game.update(Date.now()),
            this._timeOutID = window.setTimeout(this._onLoop, this.game.time.timeToCall)
        },
        stop: function() {
            this._isSetTimeOut ? clearTimeout(this._timeOutID) : window.cancelAnimationFrame(this._timeOutID),
            this.isRunning = !1
        },
        isSetTimeOut: function() {
            return this._isSetTimeOut
        },
        isRAF: function() {
            return this._isSetTimeOut === !1
        }
    },
    c.RequestAnimationFrame.prototype.constructor = c.RequestAnimationFrame,
    c.Math = {
        PI2: 2 * Math.PI,
        fuzzyEqual: function(a, b, c) {
            return void 0 === c && (c = 1e-4),
            Math.abs(a - b) < c
        },
        fuzzyLessThan: function(a, b, c) {
            return void 0 === c && (c = 1e-4),
            b + c > a
        },
        fuzzyGreaterThan: function(a, b, c) {
            return void 0 === c && (c = 1e-4),
            a > b - c
        },
        fuzzyCeil: function(a, b) {
            return void 0 === b && (b = 1e-4),
            Math.ceil(a - b)
        },
        fuzzyFloor: function(a, b) {
            return void 0 === b && (b = 1e-4),
            Math.floor(a + b)
        },
        average: function() {
            for (var a = 0, b = 0; b < arguments.length; b++)
                a += +arguments[b];
            return a / arguments.length
        },
        shear: function(a) {
            return a % 1
        },
        snapTo: function(a, b, c) {
            return void 0 === c && (c = 0),
            0 === b ? a : (a -= c,
            a = b * Math.round(a / b),
            c + a)
        },
        snapToFloor: function(a, b, c) {
            return void 0 === c && (c = 0),
            0 === b ? a : (a -= c,
            a = b * Math.floor(a / b),
            c + a)
        },
        snapToCeil: function(a, b, c) {
            return void 0 === c && (c = 0),
            0 === b ? a : (a -= c,
            a = b * Math.ceil(a / b),
            c + a)
        },
        roundTo: function(a, b, c) {
            void 0 === b && (b = 0),
            void 0 === c && (c = 10);
            var d = Math.pow(c, -b);
            return Math.round(a * d) / d
        },
        floorTo: function(a, b, c) {
            void 0 === b && (b = 0),
            void 0 === c && (c = 10);
            var d = Math.pow(c, -b);
            return Math.floor(a * d) / d
        },
        ceilTo: function(a, b, c) {
            void 0 === b && (b = 0),
            void 0 === c && (c = 10);
            var d = Math.pow(c, -b);
            return Math.ceil(a * d) / d
        },
        angleBetween: function(a, b, c, d) {
            return Math.atan2(d - b, c - a)
        },
        angleBetweenY: function(a, b, c, d) {
            return Math.atan2(c - a, d - b)
        },
        angleBetweenPoints: function(a, b) {
            return Math.atan2(b.y - a.y, b.x - a.x)
        },
        angleBetweenPointsY: function(a, b) {
            return Math.atan2(b.x - a.x, b.y - a.y)
        },
        reverseAngle: function(a) {
            return this.normalizeAngle(a + Math.PI, !0)
        },
        normalizeAngle: function(a) {
            return a %= 2 * Math.PI,
            a >= 0 ? a : a + 2 * Math.PI
        },
        maxAdd: function(a, b, c) {
            return Math.min(a + b, c)
        },
        minSub: function(a, b, c) {
            return Math.max(a - b, c)
        },
        wrap: function(a, b, c) {
            var d = c - b;
            if (0 >= d)
                return 0;
            var e = (a - b) % d;
            return 0 > e && (e += d),
            e + b
        },
        wrapValue: function(a, b, c) {
            var d;
            return a = Math.abs(a),
            b = Math.abs(b),
            c = Math.abs(c),
            d = (a + b) % c
        },
        isOdd: function(a) {
            return !!(1 & a)
        },
        isEven: function(a) {
            return !(1 & a)
        },
        min: function() {
            if (1 === arguments.length && "object" == typeof arguments[0])
                var a = arguments[0];
            else
                var a = arguments;
            for (var b = 1, c = 0, d = a.length; d > b; b++)
                a[b] < a[c] && (c = b);
            return a[c]
        },
        max: function() {
            if (1 === arguments.length && "object" == typeof arguments[0])
                var a = arguments[0];
            else
                var a = arguments;
            for (var b = 1, c = 0, d = a.length; d > b; b++)
                a[b] > a[c] && (c = b);
            return a[c]
        },
        minProperty: function(a) {
            if (2 === arguments.length && "object" == typeof arguments[1])
                var b = arguments[1];
            else
                var b = arguments.slice(1);
            for (var c = 1, d = 0, e = b.length; e > c; c++)
                b[c][a] < b[d][a] && (d = c);
            return b[d][a]
        },
        maxProperty: function(a) {
            if (2 === arguments.length && "object" == typeof arguments[1])
                var b = arguments[1];
            else
                var b = arguments.slice(1);
            for (var c = 1, d = 0, e = b.length; e > c; c++)
                b[c][a] > b[d][a] && (d = c);
            return b[d][a]
        },
        wrapAngle: function(a, b) {
            return b ? this.wrap(a, -Math.PI, Math.PI) : this.wrap(a, -180, 180)
        },
        linearInterpolation: function(a, b) {
            var c = a.length - 1
              , d = c * b
              , e = Math.floor(d);
            return 0 > b ? this.linear(a[0], a[1], d) : b > 1 ? this.linear(a[c], a[c - 1], c - d) : this.linear(a[e], a[e + 1 > c ? c : e + 1], d - e)
        },
        bezierInterpolation: function(a, b) {
            for (var c = 0, d = a.length - 1, e = 0; d >= e; e++)
                c += Math.pow(1 - b, d - e) * Math.pow(b, e) * a[e] * this.bernstein(d, e);
            return c
        },
        catmullRomInterpolation: function(a, b) {
            var c = a.length - 1
              , d = c * b
              , e = Math.floor(d);
            return a[0] === a[c] ? (0 > b && (e = Math.floor(d = c * (1 + b))),
            this.catmullRom(a[(e - 1 + c) % c], a[e], a[(e + 1) % c], a[(e + 2) % c], d - e)) : 0 > b ? a[0] - (this.catmullRom(a[0], a[0], a[1], a[1], -d) - a[0]) : b > 1 ? a[c] - (this.catmullRom(a[c], a[c], a[c - 1], a[c - 1], d - c) - a[c]) : this.catmullRom(a[e ? e - 1 : 0], a[e], a[e + 1 > c ? c : e + 1], a[e + 2 > c ? c : e + 2], d - e)
        },
        linear: function(a, b, c) {
            return (b - a) * c + a
        },
        bernstein: function(a, b) {
            return this.factorial(a) / this.factorial(b) / this.factorial(a - b)
        },
        factorial: function(a) {
            if (0 === a)
                return 1;
            for (var b = a; --a; )
                b *= a;
            return b
        },
        catmullRom: function(a, b, c, d, e) {
            var f = .5 * (c - a)
              , g = .5 * (d - b)
              , h = e * e
              , i = e * h;
            return (2 * b - 2 * c + f + g) * i + (-3 * b + 3 * c - 2 * f - g) * h + f * e + b
        },
        difference: function(a, b) {
            return Math.abs(a - b)
        },
        roundAwayFromZero: function(a) {
            return a > 0 ? Math.ceil(a) : Math.floor(a)
        },
        sinCosGenerator: function(a, b, c, d) {
            void 0 === b && (b = 1),
            void 0 === c && (c = 1),
            void 0 === d && (d = 1);
            for (var e = b, f = c, g = d * Math.PI / a, h = [], i = [], j = 0; a > j; j++)
                f -= e * g,
                e += f * g,
                h[j] = f,
                i[j] = e;
            return {
                sin: i,
                cos: h,
                length: a
            }
        },
        distance: function(a, b, c, d) {
            var e = a - c
              , f = b - d;
            return Math.sqrt(e * e + f * f)
        },
        distanceSq: function(a, b, c, d) {
            var e = a - c
              , f = b - d;
            return e * e + f * f
        },
        distancePow: function(a, b, c, d, e) {
            return void 0 === e && (e = 2),
            Math.sqrt(Math.pow(c - a, e) + Math.pow(d - b, e))
        },
        clamp: function(a, b, c) {
            return b > a ? b : a > c ? c : a
        },
        clampBottom: function(a, b) {
            return b > a ? b : a
        },
        within: function(a, b, c) {
            return Math.abs(a - b) <= c
        },
        mapLinear: function(a, b, c, d, e) {
            return d + (a - b) * (e - d) / (c - b)
        },
        smoothstep: function(a, b, c) {
            return a = Math.max(0, Math.min(1, (a - b) / (c - b))),
            a * a * (3 - 2 * a)
        },
        smootherstep: function(a, b, c) {
            return a = Math.max(0, Math.min(1, (a - b) / (c - b))),
            a * a * a * (a * (6 * a - 15) + 10)
        },
        sign: function(a) {
            return 0 > a ? -1 : a > 0 ? 1 : 0
        },
        percent: function(a, b, c) {
            return void 0 === c && (c = 0),
            a > b || c > b ? 1 : c > a || c > a ? 0 : (a - c) / b
        }
    };
    var j = Math.PI / 180
      , k = 180 / Math.PI;
    return c.Math.degToRad = function(a) {
        return a * j
    }
    ,
    c.Math.radToDeg = function(a) {
        return a * k
    }
    ,
    c.RandomDataGenerator = function(a) {
        void 0 === a && (a = []),
        this.c = 1,
        this.s0 = 0,
        this.s1 = 0,
        this.s2 = 0,
        this.sow(a)
    }
    ,
    c.RandomDataGenerator.prototype = {
        rnd: function() {
            var a = 2091639 * this.s0 + 2.3283064365386963e-10 * this.c;
            return this.c = 0 | a,
            this.s0 = this.s1,
            this.s1 = this.s2,
            this.s2 = a - this.c,
            this.s2
        },
        sow: function(a) {
            if (this.s0 = this.hash(" "),
            this.s1 = this.hash(this.s0),
            this.s2 = this.hash(this.s1),
            this.c = 1,
            a)
                for (var b = 0; b < a.length && null != a[b]; b++) {
                    var c = a[b];
                    this.s0 -= this.hash(c),
                    this.s0 += ~~(this.s0 < 0),
                    this.s1 -= this.hash(c),
                    this.s1 += ~~(this.s1 < 0),
                    this.s2 -= this.hash(c),
                    this.s2 += ~~(this.s2 < 0)
                }
        },
        hash: function(a) {
            var b, c, d;
            for (d = 4022871197,
            a = a.toString(),
            c = 0; c < a.length; c++)
                d += a.charCodeAt(c),
                b = .02519603282416938 * d,
                d = b >>> 0,
                b -= d,
                b *= d,
                d = b >>> 0,
                b -= d,
                d += 4294967296 * b;
            return 2.3283064365386963e-10 * (d >>> 0)
        },
        integer: function() {
            return 4294967296 * this.rnd.apply(this)
        },
        frac: function() {
            return this.rnd.apply(this) + 1.1102230246251565e-16 * (2097152 * this.rnd.apply(this) | 0)
        },
        real: function() {
            return this.integer() + this.frac()
        },
        integerInRange: function(a, b) {
            return Math.floor(this.realInRange(0, b - a + 1) + a)
        },
        between: function(a, b) {
            return this.integerInRange(a, b)
        },
        realInRange: function(a, b) {
            return this.frac() * (b - a) + a
        },
        normal: function() {
            return 1 - 2 * this.frac()
        },
        uuid: function() {
            var a = ""
              , b = "";
            for (b = a = ""; a++ < 36; b += ~a % 5 | 3 * a & 4 ? (15 ^ a ? 8 ^ this.frac() * (20 ^ a ? 16 : 4) : 4).toString(16) : "-")
                ;
            return b
        },
        pick: function(a) {
            return a[this.integerInRange(0, a.length - 1)]
        },
        weightedPick: function(a) {
            return a[~~(Math.pow(this.frac(), 2) * (a.length - 1) + .5)]
        },
        timestamp: function(a, b) {
            return this.realInRange(a || 9466848e5, b || 1577862e6)
        },
        angle: function() {
            return this.integerInRange(-180, 180)
        }
    },
    c.RandomDataGenerator.prototype.constructor = c.RandomDataGenerator,
    c.QuadTree = function(a, b, c, d, e, f, g) {
        this.maxObjects = 10,
        this.maxLevels = 4,
        this.level = 0,
        this.bounds = {},
        this.objects = [],
        this.nodes = [],
        this._empty = [],
        this.reset(a, b, c, d, e, f, g)
    }
    ,
    c.QuadTree.prototype = {
        reset: function(a, b, c, d, e, f, g) {
            this.maxObjects = e || 10,
            this.maxLevels = f || 4,
            this.level = g || 0,
            this.bounds = {
                x: Math.round(a),
                y: Math.round(b),
                width: c,
                height: d,
                subWidth: Math.floor(c / 2),
                subHeight: Math.floor(d / 2),
                right: Math.round(a) + Math.floor(c / 2),
                bottom: Math.round(b) + Math.floor(d / 2)
            },
            this.objects.length = 0,
            this.nodes.length = 0
        },
        populate: function(a) {
            a.forEach(this.populateHandler, this, !0)
        },
        populateHandler: function(a) {
            a.body && a.exists && this.insert(a.body)
        },
        split: function() {
            this.nodes[0] = new c.QuadTree(this.bounds.right,this.bounds.y,this.bounds.subWidth,this.bounds.subHeight,this.maxObjects,this.maxLevels,this.level + 1),
            this.nodes[1] = new c.QuadTree(this.bounds.x,this.bounds.y,this.bounds.subWidth,this.bounds.subHeight,this.maxObjects,this.maxLevels,this.level + 1),
            this.nodes[2] = new c.QuadTree(this.bounds.x,this.bounds.bottom,this.bounds.subWidth,this.bounds.subHeight,this.maxObjects,this.maxLevels,this.level + 1),
            this.nodes[3] = new c.QuadTree(this.bounds.right,this.bounds.bottom,this.bounds.subWidth,this.bounds.subHeight,this.maxObjects,this.maxLevels,this.level + 1)
        },
        insert: function(a) {
            var b, c = 0;
            if (null != this.nodes[0] && (b = this.getIndex(a),
            -1 !== b))
                return void this.nodes[b].insert(a);
            if (this.objects.push(a),
            this.objects.length > this.maxObjects && this.level < this.maxLevels)
                for (null == this.nodes[0] && this.split(); c < this.objects.length; )
                    b = this.getIndex(this.objects[c]),
                    -1 !== b ? this.nodes[b].insert(this.objects.splice(c, 1)[0]) : c++
        },
        getIndex: function(a) {
            var b = -1;
            return a.x < this.bounds.right && a.right < this.bounds.right ? a.y < this.bounds.bottom && a.bottom < this.bounds.bottom ? b = 1 : a.y > this.bounds.bottom && (b = 2) : a.x > this.bounds.right && (a.y < this.bounds.bottom && a.bottom < this.bounds.bottom ? b = 0 : a.y > this.bounds.bottom && (b = 3)),
            b
        },
        retrieve: function(a) {
            if (a instanceof c.Rectangle)
                var b = this.objects
                  , d = this.getIndex(a);
            else {
                if (!a.body)
                    return this._empty;
                var b = this.objects
                  , d = this.getIndex(a.body)
            }
            return this.nodes[0] && (-1 !== d ? b = b.concat(this.nodes[d].retrieve(a)) : (b = b.concat(this.nodes[0].retrieve(a)),
            b = b.concat(this.nodes[1].retrieve(a)),
            b = b.concat(this.nodes[2].retrieve(a)),
            b = b.concat(this.nodes[3].retrieve(a)))),
            b
        },
        clear: function() {
            this.objects.length = 0;
            for (var a = this.nodes.length; a--; )
                this.nodes[a].clear(),
                this.nodes.splice(a, 1);
            this.nodes.length = 0
        }
    },
    c.QuadTree.prototype.constructor = c.QuadTree,
    c.Net = function(a) {
        this.game = a
    }
    ,
    c.Net.prototype = {
        getHostName: function() {
            return window.location && window.location.hostname ? window.location.hostname : null
        },
        checkDomainName: function(a) {
            return -1 !== window.location.hostname.indexOf(a)
        },
        updateQueryString: function(a, b, c, d) {
            void 0 === c && (c = !1),
            (void 0 === d || "" === d) && (d = window.location.href);
            var e = ""
              , f = new RegExp("([?|&])" + a + "=.*?(&|#|$)(.*)","gi");
            if (f.test(d))
                e = "undefined" != typeof b && null !== b ? d.replace(f, "$1" + a + "=" + b + "$2$3") : d.replace(f, "$1$3").replace(/(&|\?)$/, "");
            else if ("undefined" != typeof b && null !== b) {
                var g = -1 !== d.indexOf("?") ? "&" : "?"
                  , h = d.split("#");
                d = h[0] + g + a + "=" + b,
                h[1] && (d += "#" + h[1]),
                e = d
            } else
                e = d;
            return c ? void (window.location.href = e) : e
        },
        getQueryString: function(a) {
            void 0 === a && (a = "");
            var b = {}
              , c = location.search.substring(1).split("&");
            for (var d in c) {
                var e = c[d].split("=");
                if (e.length > 1) {
                    if (a && a == this.decodeURI(e[0]))
                        return this.decodeURI(e[1]);
                    b[this.decodeURI(e[0])] = this.decodeURI(e[1])
                }
            }
            return b
        },
        decodeURI: function(a) {
            return decodeURIComponent(a.replace(/\+/g, " "))
        }
    },
    c.Net.prototype.constructor = c.Net,
    c.TweenManager = function(a) {
        this.game = a,
        this.frameBased = !1,
        this._tweens = [],
        this._add = [],
        this.easeMap = {
            Power0: c.Easing.Power0,
            Power1: c.Easing.Power1,
            Power2: c.Easing.Power2,
            Power3: c.Easing.Power3,
            Power4: c.Easing.Power4,
            Linear: c.Easing.Linear.None,
            Quad: c.Easing.Quadratic.Out,
            Cubic: c.Easing.Cubic.Out,
            Quart: c.Easing.Quartic.Out,
            Quint: c.Easing.Quintic.Out,
            Sine: c.Easing.Sinusoidal.Out,
            Expo: c.Easing.Exponential.Out,
            Circ: c.Easing.Circular.Out,
            Elastic: c.Easing.Elastic.Out,
            Back: c.Easing.Back.Out,
            Bounce: c.Easing.Bounce.Out,
            "Quad.easeIn": c.Easing.Quadratic.In,
            "Cubic.easeIn": c.Easing.Cubic.In,
            "Quart.easeIn": c.Easing.Quartic.In,
            "Quint.easeIn": c.Easing.Quintic.In,
            "Sine.easeIn": c.Easing.Sinusoidal.In,
            "Expo.easeIn": c.Easing.Exponential.In,
            "Circ.easeIn": c.Easing.Circular.In,
            "Elastic.easeIn": c.Easing.Elastic.In,
            "Back.easeIn": c.Easing.Back.In,
            "Bounce.easeIn": c.Easing.Bounce.In,
            "Quad.easeOut": c.Easing.Quadratic.Out,
            "Cubic.easeOut": c.Easing.Cubic.Out,
            "Quart.easeOut": c.Easing.Quartic.Out,
            "Quint.easeOut": c.Easing.Quintic.Out,
            "Sine.easeOut": c.Easing.Sinusoidal.Out,
            "Expo.easeOut": c.Easing.Exponential.Out,
            "Circ.easeOut": c.Easing.Circular.Out,
            "Elastic.easeOut": c.Easing.Elastic.Out,
            "Back.easeOut": c.Easing.Back.Out,
            "Bounce.easeOut": c.Easing.Bounce.Out,
            "Quad.easeInOut": c.Easing.Quadratic.InOut,
            "Cubic.easeInOut": c.Easing.Cubic.InOut,
            "Quart.easeInOut": c.Easing.Quartic.InOut,
            "Quint.easeInOut": c.Easing.Quintic.InOut,
            "Sine.easeInOut": c.Easing.Sinusoidal.InOut,
            "Expo.easeInOut": c.Easing.Exponential.InOut,
            "Circ.easeInOut": c.Easing.Circular.InOut,
            "Elastic.easeInOut": c.Easing.Elastic.InOut,
            "Back.easeInOut": c.Easing.Back.InOut,
            "Bounce.easeInOut": c.Easing.Bounce.InOut
        },
        this.game.onPause.add(this._pauseAll, this),
        this.game.onResume.add(this._resumeAll, this)
    }
    ,
    c.TweenManager.prototype = {
        getAll: function() {
            return this._tweens
        },
        removeAll: function() {
            for (var a = 0; a < this._tweens.length; a++)
                this._tweens[a].pendingDelete = !0;
            this._add = []
        },
        removeFrom: function(a, b) {
            void 0 === b && (b = !0);
            var d, e;
            if (Array.isArray(a))
                for (d = 0,
                e = a.length; e > d; d++)
                    this.removeFrom(a[d]);
            else if (a.type === c.GROUP && b)
                for (var d = 0, e = a.children.length; e > d; d++)
                    this.removeFrom(a.children[d]);
            else {
                for (d = 0,
                e = this._tweens.length; e > d; d++)
                    a === this._tweens[d].target && this.remove(this._tweens[d]);
                for (d = 0,
                e = this._add.length; e > d; d++)
                    a === this._add[d].target && this.remove(this._add[d])
            }
        },
        add: function(a) {
            a._manager = this,
            this._add.push(a)
        },
        create: function(a) {
            return new c.Tween(a,this.game,this)
        },
        remove: function(a) {
            var b = this._tweens.indexOf(a);
            -1 !== b ? this._tweens[b].pendingDelete = !0 : (b = this._add.indexOf(a),
            -1 !== b && (this._add[b].pendingDelete = !0))
        },
        update: function() {
            var a = this._add.length
              , b = this._tweens.length;
            if (0 === b && 0 === a)
                return !1;
            for (var c = 0; b > c; )
                this._tweens[c].update(this.game.time.time) ? c++ : (this._tweens.splice(c, 1),
                b--);
            return a > 0 && (this._tweens = this._tweens.concat(this._add),
            this._add.length = 0),
            !0
        },
        isTweening: function(a) {
            return this._tweens.some(function(b) {
                return b.target === a
            })
        },
        _pauseAll: function() {
            for (var a = this._tweens.length - 1; a >= 0; a--)
                this._tweens[a]._pause()
        },
        _resumeAll: function() {
            for (var a = this._tweens.length - 1; a >= 0; a--)
                this._tweens[a]._resume()
        },
        pauseAll: function() {
            for (var a = this._tweens.length - 1; a >= 0; a--)
                this._tweens[a].pause()
        },
        resumeAll: function() {
            for (var a = this._tweens.length - 1; a >= 0; a--)
                this._tweens[a].resume(!0)
        }
    },
    c.TweenManager.prototype.constructor = c.TweenManager,
    c.Tween = function(a, b, d) {
        this.game = b,
        this.target = a,
        this.manager = d,
        this.timeline = [],
        this.reverse = !1,
        this.timeScale = 1,
        this.repeatCounter = 0,
        this.pendingDelete = !1,
        this.onStart = new c.Signal,
        this.onLoop = new c.Signal,
        this.onRepeat = new c.Signal,
        this.onChildComplete = new c.Signal,
        this.onComplete = new c.Signal,
        this.isRunning = !1,
        this.current = 0,
        this.properties = {},
        this.chainedTween = null,
        this.isPaused = !1,
        this.frameBased = d.frameBased,
        this._onUpdateCallback = null,
        this._onUpdateCallbackContext = null,
        this._pausedTime = 0,
        this._codePaused = !1,
        this._hasStarted = !1
    }
    ,
    c.Tween.prototype = {
        to: function(a, b, d, e, f, g, h) {
            return (void 0 === b || 0 >= b) && (b = 1e3),
            (void 0 === d || null === d) && (d = c.Easing.Default),
            void 0 === e && (e = !1),
            void 0 === f && (f = 0),
            void 0 === g && (g = 0),
            void 0 === h && (h = !1),
            "string" == typeof d && this.manager.easeMap[d] && (d = this.manager.easeMap[d]),
            this.isRunning ? (console.warn("Phaser.Tween.to cannot be called after Tween.start"),
            this) : (this.timeline.push(new c.TweenData(this).to(a, b, d, f, g, h)),
            e && this.start(),
            this)
        },
        from: function(a, b, d, e, f, g, h) {
            return void 0 === b && (b = 1e3),
            (void 0 === d || null === d) && (d = c.Easing.Default),
            void 0 === e && (e = !1),
            void 0 === f && (f = 0),
            void 0 === g && (g = 0),
            void 0 === h && (h = !1),
            "string" == typeof d && this.manager.easeMap[d] && (d = this.manager.easeMap[d]),
            this.isRunning ? (console.warn("Phaser.Tween.from cannot be called after Tween.start"),
            this) : (this.timeline.push(new c.TweenData(this).from(a, b, d, f, g, h)),
            e && this.start(),
            this)
        },
        start: function(a) {
            if (void 0 === a && (a = 0),
            null === this.game || null === this.target || 0 === this.timeline.length || this.isRunning)
                return this;
            for (var b = 0; b < this.timeline.length; b++)
                for (var c in this.timeline[b].vEnd)
                    this.properties[c] = this.target[c] || 0,
                    Array.isArray(this.properties[c]) || (this.properties[c] *= 1);
            for (var b = 0; b < this.timeline.length; b++)
                this.timeline[b].loadValues();
            return this.manager.add(this),
            this.isRunning = !0,
            (0 > a || a > this.timeline.length - 1) && (a = 0),
            this.current = a,
            this.timeline[this.current].start(),
            this
        },
        stop: function(a) {
            return void 0 === a && (a = !1),
            this.isRunning = !1,
            this._onUpdateCallback = null,
            this._onUpdateCallbackContext = null,
            a && (this.onComplete.dispatch(this.target, this),
            this.chainedTween && this.chainedTween.start()),
            this.manager.remove(this),
            this
        },
        updateTweenData: function(a, b, c) {
            if (0 === this.timeline.length)
                return this;
            if (void 0 === c && (c = 0),
            -1 === c)
                for (var d = 0; d < this.timeline.length; d++)
                    this.timeline[d][a] = b;
            else
                this.timeline[c][a] = b;
            return this
        },
        delay: function(a, b) {
            return this.updateTweenData("delay", a, b)
        },
        repeat: function(a, b, c) {
            return void 0 === b && (b = 0),
            this.updateTweenData("repeatCounter", a, c),
            this.updateTweenData("repeatDelay", b, c)
        },
        repeatDelay: function(a, b) {
            return this.updateTweenData("repeatDelay", a, b)
        },
        yoyo: function(a, b, c) {
            return void 0 === b && (b = 0),
            this.updateTweenData("yoyo", a, c),
            this.updateTweenData("yoyoDelay", b, c)
        },
        yoyoDelay: function(a, b) {
            return this.updateTweenData("yoyoDelay", a, b)
        },
        easing: function(a, b) {
            return "string" == typeof a && this.manager.easeMap[a] && (a = this.manager.easeMap[a]),
            this.updateTweenData("easingFunction", a, b)
        },
        interpolation: function(a, b, d) {
            return void 0 === b && (b = c.Math),
            this.updateTweenData("interpolationFunction", a, d),
            this.updateTweenData("interpolationContext", b, d)
        },
        repeatAll: function(a) {
            return void 0 === a && (a = 0),
            this.repeatCounter = a,
            this
        },
        chain: function() {
            for (var a = arguments.length; a--; )
                a > 0 ? arguments[a - 1].chainedTween = arguments[a] : this.chainedTween = arguments[a];
            return this
        },
        loop: function(a) {
            return void 0 === a && (a = !0),
            a ? this.repeatAll(-1) : this.repeatCounter = 0,
            this
        },
        onUpdateCallback: function(a, b) {
            return this._onUpdateCallback = a,
            this._onUpdateCallbackContext = b,
            this
        },
        pause: function() {
            this.isPaused = !0,
            this._codePaused = !0,
            this._pausedTime = this.game.time.time
        },
        _pause: function() {
            this._codePaused || (this.isPaused = !0,
            this._pausedTime = this.game.time.time)
        },
        resume: function() {
            if (this.isPaused) {
                this.isPaused = !1,
                this._codePaused = !1;
                for (var a = 0; a < this.timeline.length; a++)
                    this.timeline[a].isRunning || (this.timeline[a].startTime += this.game.time.time - this._pausedTime)
            }
        },
        _resume: function() {
            this._codePaused || this.resume()
        },
        update: function(a) {
            if (this.pendingDelete)
                return !1;
            if (this.isPaused)
                return !0;
            var b = this.timeline[this.current].update(a);
            if (b === c.TweenData.PENDING)
                return !0;
            if (b === c.TweenData.RUNNING)
                return this._hasStarted || (this.onStart.dispatch(this.target, this),
                this._hasStarted = !0),
                null !== this._onUpdateCallback && this._onUpdateCallback.call(this._onUpdateCallbackContext, this, this.timeline[this.current].value, this.timeline[this.current]),
                this.isRunning;
            if (b === c.TweenData.LOOPED)
                return this.onLoop.dispatch(this.target, this),
                !0;
            if (b === c.TweenData.COMPLETE) {
                var d = !1;
                return this.reverse ? (this.current--,
                this.current < 0 && (this.current = this.timeline.length - 1,
                d = !0)) : (this.current++,
                this.current === this.timeline.length && (this.current = 0,
                d = !0)),
                d ? -1 === this.repeatCounter ? (this.timeline[this.current].start(),
                this.onRepeat.dispatch(this.target, this),
                !0) : this.repeatCounter > 0 ? (this.repeatCounter--,
                this.timeline[this.current].start(),
                this.onRepeat.dispatch(this.target, this),
                !0) : (this.isRunning = !1,
                this.onComplete.dispatch(this.target, this),
                this.chainedTween && this.chainedTween.start(),
                !1) : (this.onChildComplete.dispatch(this.target, this),
                this.timeline[this.current].start(),
                !0)
            }
        },
        generateData: function(a, b) {
            if (null === this.game || null === this.target)
                return null;
            void 0 === a && (a = 60),
            void 0 === b && (b = []);
            for (var c = 0; c < this.timeline.length; c++)
                for (var d in this.timeline[c].vEnd)
                    this.properties[d] = this.target[d] || 0,
                    Array.isArray(this.properties[d]) || (this.properties[d] *= 1);
            for (var c = 0; c < this.timeline.length; c++)
                this.timeline[c].loadValues();
            for (var c = 0; c < this.timeline.length; c++)
                b = b.concat(this.timeline[c].generateData(a));
            return b
        }
    },
    Object.defineProperty(c.Tween.prototype, "totalDuration", {
        get: function() {
            for (var a = 0, b = 0; b < this.timeline.length; b++)
                a += this.timeline[b].duration;
            return a
        }
    }),
    c.Tween.prototype.constructor = c.Tween,
    c.TweenData = function(a) {
        this.parent = a,
        this.game = a.game,
        this.vStart = {},
        this.vStartCache = {},
        this.vEnd = {},
        this.vEndCache = {},
        this.duration = 1e3,
        this.percent = 0,
        this.value = 0,
        this.repeatCounter = 0,
        this.repeatDelay = 0,
        this.interpolate = !1,
        this.yoyo = !1,
        this.yoyoDelay = 0,
        this.inReverse = !1,
        this.delay = 0,
        this.dt = 0,
        this.startTime = null,
        this.easingFunction = c.Easing.Default,
        this.interpolationFunction = c.Math.linearInterpolation,
        this.interpolationContext = c.Math,
        this.isRunning = !1,
        this.isFrom = !1
    }
    ,
    c.TweenData.PENDING = 0,
    c.TweenData.RUNNING = 1,
    c.TweenData.LOOPED = 2,
    c.TweenData.COMPLETE = 3,
    c.TweenData.prototype = {
        to: function(a, b, c, d, e, f) {
            return this.vEnd = a,
            this.duration = b,
            this.easingFunction = c,
            this.delay = d,
            this.repeatCounter = e,
            this.yoyo = f,
            this.isFrom = !1,
            this
        },
        from: function(a, b, c, d, e, f) {
            return this.vEnd = a,
            this.duration = b,
            this.easingFunction = c,
            this.delay = d,
            this.repeatCounter = e,
            this.yoyo = f,
            this.isFrom = !0,
            this
        },
        start: function() {
            if (this.startTime = this.game.time.time + this.delay,
            this.dt = this.parent.reverse ? this.duration : 0,
            this.isRunning = this.delay > 0 ? !1 : !0,
            this.isFrom)
                for (var a in this.vStartCache)
                    this.vStart[a] = this.vEndCache[a],
                    this.vEnd[a] = this.vStartCache[a],
                    this.parent.target[a] = this.vStart[a];
            return this.value = 0,
            this.yoyoCounter = 0,
            this
        },
        loadValues: function() {
            for (var a in this.parent.properties) {
                if (this.vStart[a] = this.parent.properties[a],
                Array.isArray(this.vEnd[a])) {
                    if (0 === this.vEnd[a].length)
                        continue;
                    0 === this.percent && (this.vEnd[a] = [this.vStart[a]].concat(this.vEnd[a]))
                }
                "undefined" != typeof this.vEnd[a] ? ("string" == typeof this.vEnd[a] && (this.vEnd[a] = this.vStart[a] + parseFloat(this.vEnd[a], 10)),
                this.parent.properties[a] = this.vEnd[a]) : this.vEnd[a] = this.vStart[a],
                this.vStartCache[a] = this.vStart[a],
                this.vEndCache[a] = this.vEnd[a]
            }
            return this
        },
        update: function(a) {
            if (this.isRunning) {
                if (a < this.startTime)
                    return c.TweenData.RUNNING
            } else {
                if (!(a >= this.startTime))
                    return c.TweenData.PENDING;
                this.isRunning = !0
            }
            var b = this.parent.frameBased ? this.game.time.physicsElapsedMS : this.game.time.elapsedMS;
            this.parent.reverse ? (this.dt -= b * this.parent.timeScale,
            this.dt = Math.max(this.dt, 0)) : (this.dt += b * this.parent.timeScale,
            this.dt = Math.min(this.dt, this.duration)),
            this.percent = this.dt / this.duration,
            this.value = this.easingFunction(this.percent);
            for (var d in this.vEnd) {
                var e = this.vStart[d]
                  , f = this.vEnd[d];
                this.parent.target[d] = Array.isArray(f) ? this.interpolationFunction.call(this.interpolationContext, f, this.value) : e + (f - e) * this.value
            }
            return !this.parent.reverse && 1 === this.percent || this.parent.reverse && 0 === this.percent ? this.repeat() : c.TweenData.RUNNING
        },
        generateData: function(a) {
            this.dt = this.parent.reverse ? this.duration : 0;
            var b = []
              , c = !1
              , d = 1 / a * 1e3;
            do {
                this.parent.reverse ? (this.dt -= d,
                this.dt = Math.max(this.dt, 0)) : (this.dt += d,
                this.dt = Math.min(this.dt, this.duration)),
                this.percent = this.dt / this.duration,
                this.value = this.easingFunction(this.percent);
                var e = {};
                for (var f in this.vEnd) {
                    var g = this.vStart[f]
                      , h = this.vEnd[f];
                    e[f] = Array.isArray(h) ? this.interpolationFunction(h, this.value) : g + (h - g) * this.value
                }
                b.push(e),
                (!this.parent.reverse && 1 === this.percent || this.parent.reverse && 0 === this.percent) && (c = !0)
            } while (!c);
            if (this.yoyo) {
                var i = b.slice();
                i.reverse(),
                b = b.concat(i)
            }
            return b
        },
        repeat: function() {
            if (this.yoyo) {
                if (this.inReverse && 0 === this.repeatCounter)
                    return c.TweenData.COMPLETE;
                this.inReverse = !this.inReverse
            } else if (0 === this.repeatCounter)
                return c.TweenData.COMPLETE;
            if (this.inReverse)
                for (var a in this.vStartCache)
                    this.vStart[a] = this.vEndCache[a],
                    this.vEnd[a] = this.vStartCache[a];
            else {
                for (var a in this.vStartCache)
                    this.vStart[a] = this.vStartCache[a],
                    this.vEnd[a] = this.vEndCache[a];
                this.repeatCounter > 0 && this.repeatCounter--
            }
            return this.startTime = this.game.time.time,
            this.yoyo && this.inReverse ? this.startTime += this.yoyoDelay : this.inReverse || (this.startTime += this.repeatDelay),
            this.dt = this.parent.reverse ? this.duration : 0,
            c.TweenData.LOOPED
        }
    },
    c.TweenData.prototype.constructor = c.TweenData,
    c.Easing = {
        Linear: {
            None: function(a) {
                return a
            }
        },
        Quadratic: {
            In: function(a) {
                return a * a
            },
            Out: function(a) {
                return a * (2 - a)
            },
            InOut: function(a) {
                return (a *= 2) < 1 ? .5 * a * a : -.5 * (--a * (a - 2) - 1)
            }
        },
        Cubic: {
            In: function(a) {
                return a * a * a
            },
            Out: function(a) {
                return --a * a * a + 1
            },
            InOut: function(a) {
                return (a *= 2) < 1 ? .5 * a * a * a : .5 * ((a -= 2) * a * a + 2)
            }
        },
        Quartic: {
            In: function(a) {
                return a * a * a * a
            },
            Out: function(a) {
                return 1 - --a * a * a * a
            },
            InOut: function(a) {
                return (a *= 2) < 1 ? .5 * a * a * a * a : -.5 * ((a -= 2) * a * a * a - 2)
            }
        },
        Quintic: {
            In: function(a) {
                return a * a * a * a * a
            },
            Out: function(a) {
                return --a * a * a * a * a + 1
            },
            InOut: function(a) {
                return (a *= 2) < 1 ? .5 * a * a * a * a * a : .5 * ((a -= 2) * a * a * a * a + 2)
            }
        },
        Sinusoidal: {
            In: function(a) {
                return 0 === a ? 0 : 1 === a ? 1 : 1 - Math.cos(a * Math.PI / 2)
            },
            Out: function(a) {
                return 0 === a ? 0 : 1 === a ? 1 : Math.sin(a * Math.PI / 2)
            },
            InOut: function(a) {
                return 0 === a ? 0 : 1 === a ? 1 : .5 * (1 - Math.cos(Math.PI * a))
            }
        },
        Exponential: {
            In: function(a) {
                return 0 === a ? 0 : Math.pow(1024, a - 1)
            },
            Out: function(a) {
                return 1 === a ? 1 : 1 - Math.pow(2, -10 * a)
            },
            InOut: function(a) {
                return 0 === a ? 0 : 1 === a ? 1 : (a *= 2) < 1 ? .5 * Math.pow(1024, a - 1) : .5 * (-Math.pow(2, -10 * (a - 1)) + 2)
            }
        },
        Circular: {
            In: function(a) {
                return 1 - Math.sqrt(1 - a * a)
            },
            Out: function(a) {
                return Math.sqrt(1 - --a * a)
            },
            InOut: function(a) {
                return (a *= 2) < 1 ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
            }
        },
        Elastic: {
            In: function(a) {
                var b, c = .1, d = .4;
                return 0 === a ? 0 : 1 === a ? 1 : (!c || 1 > c ? (c = 1,
                b = d / 4) : b = d * Math.asin(1 / c) / (2 * Math.PI),
                -(c * Math.pow(2, 10 * (a -= 1)) * Math.sin(2 * (a - b) * Math.PI / d)))
            },
            Out: function(a) {
                var b, c = .1, d = .4;
                return 0 === a ? 0 : 1 === a ? 1 : (!c || 1 > c ? (c = 1,
                b = d / 4) : b = d * Math.asin(1 / c) / (2 * Math.PI),
                c * Math.pow(2, -10 * a) * Math.sin(2 * (a - b) * Math.PI / d) + 1)
            },
            InOut: function(a) {
                var b, c = .1, d = .4;
                return 0 === a ? 0 : 1 === a ? 1 : (!c || 1 > c ? (c = 1,
                b = d / 4) : b = d * Math.asin(1 / c) / (2 * Math.PI),
                (a *= 2) < 1 ? -.5 * c * Math.pow(2, 10 * (a -= 1)) * Math.sin(2 * (a - b) * Math.PI / d) : c * Math.pow(2, -10 * (a -= 1)) * Math.sin(2 * (a - b) * Math.PI / d) * .5 + 1)
            }
        },
        Back: {
            In: function(a) {
                var b = 1.70158;
                return a * a * ((b + 1) * a - b)
            },
            Out: function(a) {
                var b = 1.70158;
                return --a * a * ((b + 1) * a + b) + 1
            },
            InOut: function(a) {
                var b = 2.5949095;
                return (a *= 2) < 1 ? .5 * a * a * ((b + 1) * a - b) : .5 * ((a -= 2) * a * ((b + 1) * a + b) + 2)
            }
        },
        Bounce: {
            In: function(a) {
                return 1 - c.Easing.Bounce.Out(1 - a)
            },
            Out: function(a) {
                return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
            },
            InOut: function(a) {
                return .5 > a ? .5 * c.Easing.Bounce.In(2 * a) : .5 * c.Easing.Bounce.Out(2 * a - 1) + .5
            }
        }
    },
    c.Easing.Default = c.Easing.Linear.None,
    c.Easing.Power0 = c.Easing.Linear.None,
    c.Easing.Power1 = c.Easing.Quadratic.Out,
    c.Easing.Power2 = c.Easing.Cubic.Out,
    c.Easing.Power3 = c.Easing.Quartic.Out,
    c.Easing.Power4 = c.Easing.Quintic.Out,
    c.Time = function(a) {
        this.game = a,
        this.time = 0,
        this.prevTime = 0,
        this.now = 0,
        this.elapsed = 0,
        this.elapsedMS = 0,
        this.physicsElapsed = 0,
        this.physicsElapsedMS = 0,
        this.desiredFps = 60,
        this.suggestedFps = null,
        this.slowMotion = 1,
        this.advancedTiming = !1,
        this.frames = 0,
        this.fps = 0,
        this.fpsMin = 1e3,
        this.fpsMax = 0,
        this.msMin = 1e3,
        this.msMax = 0,
        this.pauseDuration = 0,
        this.timeToCall = 0,
        this.timeExpected = 0,
        this.events = new c.Timer(this.game,!1),
        this._frameCount = 0,
        this._elapsedAccumulator = 0,
        this._started = 0,
        this._timeLastSecond = 0,
        this._pauseStarted = 0,
        this._justResumed = !1,
        this._timers = []
    }
    ,
    c.Time.prototype = {
        boot: function() {
            this._started = Date.now(),
            this.time = Date.now(),
            this.events.start()
        },
        add: function(a) {
            return this._timers.push(a),
            a
        },
        create: function(a) {
            void 0 === a && (a = !0);
            var b = new c.Timer(this.game,a);
            return this._timers.push(b),
            b
        },
        removeAll: function() {
            for (var a = 0; a < this._timers.length; a++)
                this._timers[a].destroy();
            this._timers = [],
            this.events.removeAll()
        },
        update: function(a) {
            this.game.raf._isSetTimeOut ? this.updateSetTimeout(a) : this.updateRAF(a),
            this.advancedTiming && this.updateAdvancedTiming(),
            this.game.paused || (this.events.update(this.time),
            this._timers.length && this.updateTimers())
        },
        updateSetTimeout: function(a) {
            var b = this.time;
            this.time = a,
            this.elapsedMS = this.time - b,
            this.prevTime = this.now,
            this.now = a,
            this.elapsed = this.now - this.prevTime,
            this.timeToCall = Math.floor(Math.max(0, 1e3 / this.desiredFps - (this.timeCallExpected - a))),
            this.timeCallExpected = a + this.timeToCall,
            this.physicsElapsed = 1 / this.desiredFps,
            this.physicsElapsedMS = 1e3 * this.physicsElapsed
        },
        updateRAF: function(a) {
            var b = this.time;
            this.time = Date.now(),
            this.elapsedMS = this.time - b,
            this.prevTime = this.now,
            this.now = a,
            this.elapsed = this.now - this.prevTime,
            this.physicsElapsed = 1 / this.desiredFps,
            this.physicsElapsedMS = 1e3 * this.physicsElapsed
        },
        updateTimers: function() {
            for (var a = 0, b = this._timers.length; b > a; )
                this._timers[a].update(this.time) ? a++ : (this._timers.splice(a, 1),
                b--)
        },
        updateAdvancedTiming: function() {
            this._frameCount++,
            this._elapsedAccumulator += this.elapsed,
            this._frameCount >= 2 * this.desiredFps && (this.suggestedFps = 5 * Math.floor(200 / (this._elapsedAccumulator / this._frameCount)),
            this._frameCount = 0,
            this._elapsedAccumulator = 0),
            this.msMin = Math.min(this.msMin, this.elapsed),
            this.msMax = Math.max(this.msMax, this.elapsed),
            this.frames++,
            this.now > this._timeLastSecond + 1e3 && (this.fps = Math.round(1e3 * this.frames / (this.now - this._timeLastSecond)),
            this.fpsMin = Math.min(this.fpsMin, this.fps),
            this.fpsMax = Math.max(this.fpsMax, this.fps),
            this._timeLastSecond = this.now,
            this.frames = 0)
        },
        gamePaused: function() {
            this._pauseStarted = Date.now(),
            this.events.pause();
            for (var a = this._timers.length; a--; )
                this._timers[a]._pause()
        },
        gameResumed: function() {
            this.time = Date.now(),
            this.pauseDuration = this.time - this._pauseStarted,
            this.events.resume();
            for (var a = this._timers.length; a--; )
                this._timers[a]._resume()
        },
        totalElapsedSeconds: function() {
            return .001 * (this.time - this._started)
        },
        elapsedSince: function(a) {
            return this.time - a
        },
        elapsedSecondsSince: function(a) {
            return .001 * (this.time - a)
        },
        reset: function() {
            this._started = this.time,
            this.removeAll()
        }
    },
    c.Time.prototype.constructor = c.Time,
    c.Timer = function(a, b) {
        void 0 === b && (b = !0),
        this.game = a,
        this.running = !1,
        this.autoDestroy = b,
        this.expired = !1,
        this.elapsed = 0,
        this.events = [],
        this.onComplete = new c.Signal,
        this.nextTick = 0,
        this.timeCap = 1e3,
        this.paused = !1,
        this._codePaused = !1,
        this._started = 0,
        this._pauseStarted = 0,
        this._pauseTotal = 0,
        this._now = Date.now(),
        this._len = 0,
        this._marked = 0,
        this._i = 0,
        this._diff = 0,
        this._newTick = 0
    }
    ,
    c.Timer.MINUTE = 6e4,
    c.Timer.SECOND = 1e3,
    c.Timer.HALF = 500,
    c.Timer.QUARTER = 250,
    c.Timer.prototype = {
        create: function(a, b, d, e, f, g) {
            a = Math.round(a);
            var h = a;
            h += 0 === this._now ? this.game.time.time : this._now;
            var i = new c.TimerEvent(this,a,h,d,b,e,f,g);
            return this.events.push(i),
            this.order(),
            this.expired = !1,
            i
        },
        add: function(a, b, c) {
            return this.create(a, !1, 0, b, c, Array.prototype.splice.call(arguments, 3))
        },
        repeat: function(a, b, c, d) {
            return this.create(a, !1, b, c, d, Array.prototype.splice.call(arguments, 4))
        },
        loop: function(a, b, c) {
            return this.create(a, !0, 0, b, c, Array.prototype.splice.call(arguments, 3))
        },
        start: function(a) {
            if (!this.running) {
                this._started = this.game.time.time + (a || 0),
                this.running = !0;
                for (var b = 0; b < this.events.length; b++)
                    this.events[b].tick = this.events[b].delay + this._started
            }
        },
        stop: function(a) {
            this.running = !1,
            void 0 === a && (a = !0),
            a && (this.events.length = 0)
        },
        remove: function(a) {
            for (var b = 0; b < this.events.length; b++)
                if (this.events[b] === a)
                    return this.events[b].pendingDelete = !0,
                    !0;
            return !1
        },
        order: function() {
            this.events.length > 0 && (this.events.sort(this.sortHandler),
            this.nextTick = this.events[0].tick)
        },
        sortHandler: function(a, b) {
            return a.tick < b.tick ? -1 : a.tick > b.tick ? 1 : 0
        },
        clearPendingEvents: function() {
            for (this._i = this.events.length; this._i--; )
                this.events[this._i].pendingDelete && this.events.splice(this._i, 1);
            this._len = this.events.length,
            this._i = 0
        },
        update: function(a) {
            if (this.paused)
                return !0;
            if (this.elapsed = a - this._now,
            this._now = a,
            this.elapsed > this.timeCap && this.adjustEvents(a - this.elapsed),
            this._marked = 0,
            this.clearPendingEvents(),
            this.running && this._now >= this.nextTick && this._len > 0) {
                for (; this._i < this._len && this.running && this._now >= this.events[this._i].tick && !this.events[this._i].pendingDelete; )
                    this._newTick = this._now + this.events[this._i].delay - (this._now - this.events[this._i].tick),
                    this._newTick < 0 && (this._newTick = this._now + this.events[this._i].delay),
                    this.events[this._i].loop === !0 ? (this.events[this._i].tick = this._newTick,
                    this.events[this._i].callback.apply(this.events[this._i].callbackContext, this.events[this._i].args)) : this.events[this._i].repeatCount > 0 ? (this.events[this._i].repeatCount--,
                    this.events[this._i].tick = this._newTick,
                    this.events[this._i].callback.apply(this.events[this._i].callbackContext, this.events[this._i].args)) : (this._marked++,
                    this.events[this._i].pendingDelete = !0,
                    this.events[this._i].callback.apply(this.events[this._i].callbackContext, this.events[this._i].args)),
                    this._i++;
                this.events.length > this._marked ? this.order() : (this.expired = !0,
                this.onComplete.dispatch(this))
            }
            return this.expired && this.autoDestroy ? !1 : !0
        },
        pause: function() {
            this.running && (this._codePaused = !0,
            this.paused || (this._pauseStarted = this.game.time.time,
            this.paused = !0))
        },
        _pause: function() {
            !this.paused && this.running && (this._pauseStarted = this.game.time.time,
            this.paused = !0)
        },
        adjustEvents: function(a) {
            for (var b = 0; b < this.events.length; b++)
                if (!this.events[b].pendingDelete) {
                    var c = this.events[b].tick - a;
                    0 > c && (c = 0),
                    this.events[b].tick = this._now + c
                }
            var d = this.nextTick - a;
            this.nextTick = 0 > d ? this._now : this._now + d
        },
        resume: function() {
            if (this.paused) {
                var a = this.game.time.time;
                this._pauseTotal += a - this._now,
                this._now = a,
                this.adjustEvents(this._pauseStarted),
                this.paused = !1,
                this._codePaused = !1
            }
        },
        _resume: function() {
            this._codePaused || this.resume()
        },
        removeAll: function() {
            this.onComplete.removeAll(),
            this.events.length = 0,
            this._len = 0,
            this._i = 0
        },
        destroy: function() {
            this.onComplete.removeAll(),
            this.running = !1,
            this.events = [],
            this._len = 0,
            this._i = 0
        }
    },
    Object.defineProperty(c.Timer.prototype, "next", {
        get: function() {
            return this.nextTick
        }
    }),
    Object.defineProperty(c.Timer.prototype, "duration", {
        get: function() {
            return this.running && this.nextTick > this._now ? this.nextTick - this._now : 0
        }
    }),
    Object.defineProperty(c.Timer.prototype, "length", {
        get: function() {
            return this.events.length
        }
    }),
    Object.defineProperty(c.Timer.prototype, "ms", {
        get: function() {
            return this.running ? this._now - this._started - this._pauseTotal : 0
        }
    }),
    Object.defineProperty(c.Timer.prototype, "seconds", {
        get: function() {
            return this.running ? .001 * this.ms : 0
        }
    }),
    c.Timer.prototype.constructor = c.Timer,
    c.TimerEvent = function(a, b, c, d, e, f, g, h) {
        this.timer = a,
        this.delay = b,
        this.tick = c,
        this.repeatCount = d - 1,
        this.loop = e,
        this.callback = f,
        this.callbackContext = g,
        this.args = h,
        this.pendingDelete = !1
    }
    ,
    c.TimerEvent.prototype.constructor = c.TimerEvent,
    c.AnimationManager = function(a) {
        this.sprite = a,
        this.game = a.game,
        this.currentFrame = null,
        this.currentAnim = null,
        this.updateIfVisible = !0,
        this.isLoaded = !1,
        this._frameData = null,
        this._anims = {},
        this._outputFrames = []
    }
    ,
    c.AnimationManager.prototype = {
        loadFrameData: function(a, b) {
            if (void 0 === a)
                return !1;
            if (this.isLoaded)
                for (var c in this._anims)
                    this._anims[c].updateFrameData(a);
            return this._frameData = a,
            void 0 === b || null === b ? this.frame = 0 : "string" == typeof b ? this.frameName = b : this.frame = b,
            this.isLoaded = !0,
            !0
        },
        copyFrameData: function(a, b) {
            if (this._frameData = a.clone(),
            this.isLoaded)
                for (var c in this._anims)
                    this._anims[c].updateFrameData(this._frameData);
            return void 0 === b || null === b ? this.frame = 0 : "string" == typeof b ? this.frameName = b : this.frame = b,
            this.isLoaded = !0,
            !0
        },
        add: function(a, b, d, e, f) {
            return b = b || [],
            d = d || 60,
            void 0 === e && (e = !1),
            void 0 === f && (f = b && "number" == typeof b[0] ? !0 : !1),
            this._outputFrames = [],
            this._frameData.getFrameIndexes(b, f, this._outputFrames),
            this._anims[a] = new c.Animation(this.game,this.sprite,a,this._frameData,this._outputFrames,d,e),
            this.currentAnim = this._anims[a],
            this.sprite.tilingTexture && (this.sprite.refreshTexture = !0),
            this._anims[a]
        },
        validateFrames: function(a, b) {
            void 0 === b && (b = !0);
            for (var c = 0; c < a.length; c++)
                if (b === !0) {
                    if (a[c] > this._frameData.total)
                        return !1
                } else if (this._frameData.checkFrameName(a[c]) === !1)
                    return !1;
            return !0
        },
        play: function(a, b, c, d) {
            return this._anims[a] ? this.currentAnim === this._anims[a] ? this.currentAnim.isPlaying === !1 ? (this.currentAnim.paused = !1,
            this.currentAnim.play(b, c, d)) : this.currentAnim : (this.currentAnim && this.currentAnim.isPlaying && this.currentAnim.stop(),
            this.currentAnim = this._anims[a],
            this.currentAnim.paused = !1,
            this.currentFrame = this.currentAnim.currentFrame,
            this.currentAnim.play(b, c, d)) : void 0
        },
        stop: function(a, b) {
            void 0 === b && (b = !1),
            "string" == typeof a ? this._anims[a] && (this.currentAnim = this._anims[a],
            this.currentAnim.stop(b)) : this.currentAnim && this.currentAnim.stop(b)
        },
        update: function() {
            return this.updateIfVisible && !this.sprite.visible ? !1 : this.currentAnim && this.currentAnim.update() ? (this.currentFrame = this.currentAnim.currentFrame,
            !0) : !1
        },
        next: function(a) {
            this.currentAnim && (this.currentAnim.next(a),
            this.currentFrame = this.currentAnim.currentFrame)
        },
        previous: function(a) {
            this.currentAnim && (this.currentAnim.previous(a),
            this.currentFrame = this.currentAnim.currentFrame)
        },
        getAnimation: function(a) {
            return "string" == typeof a && this._anims[a] ? this._anims[a] : null
        },
        refreshFrame: function() {
            this.sprite.setTexture(PIXI.TextureCache[this.currentFrame.uuid])
        },
        destroy: function() {
            var a = null;
            for (var a in this._anims)
                this._anims.hasOwnProperty(a) && this._anims[a].destroy();
            this._anims = {},
            this._outputFrames = [],
            this._frameData = null,
            this.currentAnim = null,
            this.currentFrame = null,
            this.sprite = null,
            this.game = null
        }
    },
    c.AnimationManager.prototype.constructor = c.AnimationManager,
    Object.defineProperty(c.AnimationManager.prototype, "frameData", {
        get: function() {
            return this._frameData
        }
    }),
    Object.defineProperty(c.AnimationManager.prototype, "frameTotal", {
        get: function() {
            return this._frameData.total
        }
    }),
    Object.defineProperty(c.AnimationManager.prototype, "paused", {
        get: function() {
            return this.currentAnim.isPaused
        },
        set: function(a) {
            this.currentAnim.paused = a
        }
    }),
    Object.defineProperty(c.AnimationManager.prototype, "name", {
        get: function() {
            return this.currentAnim ? this.currentAnim.name : void 0
        }
    }),
    Object.defineProperty(c.AnimationManager.prototype, "frame", {
        get: function() {
            return this.currentFrame ? this.currentFrame.index : void 0
        },
        set: function(a) {
            "number" == typeof a && this._frameData && null !== this._frameData.getFrame(a) && (this.currentFrame = this._frameData.getFrame(a),
            this.currentFrame && this.sprite.setFrame(this.currentFrame))
        }
    }),
    Object.defineProperty(c.AnimationManager.prototype, "frameName", {
        get: function() {
            return this.currentFrame ? this.currentFrame.name : void 0
        },
        set: function(a) {
            "string" == typeof a && this._frameData && null !== this._frameData.getFrameByName(a) ? (this.currentFrame = this._frameData.getFrameByName(a),
            this.currentFrame && (this._frameIndex = this.currentFrame.index,
            this.sprite.setFrame(this.currentFrame))) : console.warn("Cannot set frameName: " + a)
        }
    }),
    c.Animation = function(a, b, d, e, f, g, h) {
        void 0 === h && (h = !1),
        this.game = a,
        this._parent = b,
        this._frameData = e,
        this.name = d,
        this._frames = [],
        this._frames = this._frames.concat(f),
        this.delay = 1e3 / g,
        this.loop = h,
        this.loopCount = 0,
        this.killOnComplete = !1,
        this.isFinished = !1,
        this.isPlaying = !1,
        this.isPaused = !1,
        this._pauseStartTime = 0,
        this._frameIndex = 0,
        this._frameDiff = 0,
        this._frameSkip = 1,
        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]),
        this.onStart = new c.Signal,
        this.onUpdate = null,
        this.onComplete = new c.Signal,
        this.onLoop = new c.Signal,
        this.game.onPause.add(this.onPause, this),
        this.game.onResume.add(this.onResume, this)
    }
    ,
    c.Animation.prototype = {
        play: function(a, b, c) {
            return "number" == typeof a && (this.delay = 1e3 / a),
            "boolean" == typeof b && (this.loop = b),
            "undefined" != typeof c && (this.killOnComplete = c),
            this.isPlaying = !0,
            this.isFinished = !1,
            this.paused = !1,
            this.loopCount = 0,
            this._timeLastFrame = this.game.time.time,
            this._timeNextFrame = this.game.time.time + this.delay,
            this._frameIndex = 0,
            this.updateCurrentFrame(!1, !0),
            this._parent.events.onAnimationStart$dispatch(this._parent, this),
            this.onStart.dispatch(this._parent, this),
            this._parent.animations.currentAnim = this,
            this._parent.animations.currentFrame = this.currentFrame,
            this
        },
        restart: function() {
            this.isPlaying = !0,
            this.isFinished = !1,
            this.paused = !1,
            this.loopCount = 0,
            this._timeLastFrame = this.game.time.time,
            this._timeNextFrame = this.game.time.time + this.delay,
            this._frameIndex = 0,
            this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]),
            this._parent.setFrame(this.currentFrame),
            this._parent.animations.currentAnim = this,
            this._parent.animations.currentFrame = this.currentFrame,
            this.onStart.dispatch(this._parent, this)
        },
        setFrame: function(a, b) {
            var c;
            if (void 0 === b && (b = !1),
            "string" == typeof a)
                for (var d = 0; d < this._frames.length; d++)
                    this._frameData.getFrame(this._frames[d]).name === a && (c = d);
            else if ("number" == typeof a)
                if (b)
                    c = a;
                else
                    for (var d = 0; d < this._frames.length; d++)
                        this._frames[d] === c && (c = d);
            c && (this._frameIndex = c - 1,
            this._timeNextFrame = this.game.time.time,
            this.update())
        },
        stop: function(a, b) {
            void 0 === a && (a = !1),
            void 0 === b && (b = !1),
            this.isPlaying = !1,
            this.isFinished = !0,
            this.paused = !1,
            a && (this.currentFrame = this._frameData.getFrame(this._frames[0]),
            this._parent.setFrame(this.currentFrame)),
            b && (this._parent.events.onAnimationComplete$dispatch(this._parent, this),
            this.onComplete.dispatch(this._parent, this))
        },
        onPause: function() {
            this.isPlaying && (this._frameDiff = this._timeNextFrame - this.game.time.time)
        },
        onResume: function() {
            this.isPlaying && (this._timeNextFrame = this.game.time.time + this._frameDiff)
        },
        update: function() {
            return this.isPaused ? !1 : this.isPlaying && this.game.time.time >= this._timeNextFrame ? (this._frameSkip = 1,
            this._frameDiff = this.game.time.time - this._timeNextFrame,
            this._timeLastFrame = this.game.time.time,
            this._frameDiff > this.delay && (this._frameSkip = Math.floor(this._frameDiff / this.delay),
            this._frameDiff -= this._frameSkip * this.delay),
            this._timeNextFrame = this.game.time.time + (this.delay - this._frameDiff),
            this._frameIndex += this._frameSkip,
            this._frameIndex >= this._frames.length ? this.loop ? (this._frameIndex %= this._frames.length,
            this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]),
            this.currentFrame && this._parent.setFrame(this.currentFrame),
            this.loopCount++,
            this._parent.events.onAnimationLoop$dispatch(this._parent, this),
            this.onLoop.dispatch(this._parent, this),
            this.onUpdate ? (this.onUpdate.dispatch(this, this.currentFrame),
            !!this._frameData) : !0) : (this.complete(),
            !1) : this.updateCurrentFrame(!0)) : !1
        },
        updateCurrentFrame: function(a, b) {
            if (void 0 === b && (b = !1),
            !this._frameData)
                return !1;
            var c = this.currentFrame.index;
            return this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]),
            this.currentFrame && (b || !b && c !== this.currentFrame.index) && this._parent.setFrame(this.currentFrame),
            this.onUpdate && a ? (this.onUpdate.dispatch(this, this.currentFrame),
            !!this._frameData) : !0
        },
        next: function(a) {
            void 0 === a && (a = 1);
            var b = this._frameIndex + a;
            b >= this._frames.length && (this.loop ? b %= this._frames.length : b = this._frames.length - 1),
            b !== this._frameIndex && (this._frameIndex = b,
            this.updateCurrentFrame(!0))
        },
        previous: function(a) {
            void 0 === a && (a = 1);
            var b = this._frameIndex - a;
            0 > b && (this.loop ? b = this._frames.length + b : b++),
            b !== this._frameIndex && (this._frameIndex = b,
            this.updateCurrentFrame(!0))
        },
        updateFrameData: function(a) {
            this._frameData = a,
            this.currentFrame = this._frameData ? this._frameData.getFrame(this._frames[this._frameIndex % this._frames.length]) : null
        },
        destroy: function() {
            this._frameData && (this.game.onPause.remove(this.onPause, this),
            this.game.onResume.remove(this.onResume, this),
            this.game = null,
            this._parent = null,
            this._frames = null,
            this._frameData = null,
            this.currentFrame = null,
            this.isPlaying = !1,
            this.onStart.dispose(),
            this.onLoop.dispose(),
            this.onComplete.dispose(),
            this.onUpdate && this.onUpdate.dispose())
        },
        complete: function() {
            this._frameIndex = this._frames.length - 1,
            this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]),
            this.isPlaying = !1,
            this.isFinished = !0,
            this.paused = !1,
            this._parent.events.onAnimationComplete$dispatch(this._parent, this),
            this.onComplete.dispatch(this._parent, this),
            this.killOnComplete && this._parent.kill()
        }
    },
    c.Animation.prototype.constructor = c.Animation,
    Object.defineProperty(c.Animation.prototype, "paused", {
        get: function() {
            return this.isPaused
        },
        set: function(a) {
            this.isPaused = a,
            a ? this._pauseStartTime = this.game.time.time : this.isPlaying && (this._timeNextFrame = this.game.time.time + this.delay)
        }
    }),
    Object.defineProperty(c.Animation.prototype, "frameTotal", {
        get: function() {
            return this._frames.length
        }
    }),
    Object.defineProperty(c.Animation.prototype, "frame", {
        get: function() {
            return null !== this.currentFrame ? this.currentFrame.index : this._frameIndex
        },
        set: function(a) {
            this.currentFrame = this._frameData.getFrame(this._frames[a]),
            null !== this.currentFrame && (this._frameIndex = a,
            this._parent.setFrame(this.currentFrame),
            this.onUpdate && this.onUpdate.dispatch(this, this.currentFrame))
        }
    }),
    Object.defineProperty(c.Animation.prototype, "speed", {
        get: function() {
            return Math.round(1e3 / this.delay)
        },
        set: function(a) {
            a >= 1 && (this.delay = 1e3 / a)
        }
    }),
    Object.defineProperty(c.Animation.prototype, "enableUpdate", {
        get: function() {
            return null !== this.onUpdate
        },
        set: function(a) {
            a && null === this.onUpdate ? this.onUpdate = new c.Signal : a || null === this.onUpdate || (this.onUpdate.dispose(),
            this.onUpdate = null)
        }
    }),
    c.Animation.generateFrameNames = function(a, b, d, e, f) {
        void 0 === e && (e = "");
        var g = []
          , h = "";
        if (d > b)
            for (var i = b; d >= i; i++)
                h = "number" == typeof f ? c.Utils.pad(i.toString(), f, "0", 1) : i.toString(),
                h = a + h + e,
                g.push(h);
        else
            for (var i = b; i >= d; i--)
                h = "number" == typeof f ? c.Utils.pad(i.toString(), f, "0", 1) : i.toString(),
                h = a + h + e,
                g.push(h);
        return g
    }
    ,
    c.Frame = function(a, b, d, e, f, g) {
        this.index = a,
        this.x = b,
        this.y = d,
        this.width = e,
        this.height = f,
        this.name = g,
        this.centerX = Math.floor(e / 2),
        this.centerY = Math.floor(f / 2),
        this.distance = c.Math.distance(0, 0, e, f),
        this.rotated = !1,
        this.rotationDirection = "cw",
        this.trimmed = !1,
        this.sourceSizeW = e,
        this.sourceSizeH = f,
        this.spriteSourceSizeX = 0,
        this.spriteSourceSizeY = 0,
        this.spriteSourceSizeW = 0,
        this.spriteSourceSizeH = 0,
        this.right = this.x + this.width,
        this.bottom = this.y + this.height
    }
    ,
    c.Frame.prototype = {
        resize: function(a, b) {
            this.width = a,
            this.height = b,
            this.centerX = Math.floor(a / 2),
            this.centerY = Math.floor(b / 2),
            this.distance = c.Math.distance(0, 0, a, b),
            this.sourceSizeW = a,
            this.sourceSizeH = b,
            this.right = this.x + a,
            this.bottom = this.y + b
        },
        setTrim: function(a, b, c, d, e, f, g) {
            this.trimmed = a,
            a && (this.sourceSizeW = b,
            this.sourceSizeH = c,
            this.centerX = Math.floor(b / 2),
            this.centerY = Math.floor(c / 2),
            this.spriteSourceSizeX = d,
            this.spriteSourceSizeY = e,
            this.spriteSourceSizeW = f,
            this.spriteSourceSizeH = g)
        },
        clone: function() {
            var a = new c.Frame(this.index,this.x,this.y,this.width,this.height,this.name);
            for (var b in this)
                this.hasOwnProperty(b) && (a[b] = this[b]);
            return a
        },
        getRect: function(a) {
            return void 0 === a ? a = new c.Rectangle(this.x,this.y,this.width,this.height) : a.setTo(this.x, this.y, this.width, this.height),
            a
        }
    },
    c.Frame.prototype.constructor = c.Frame,
    c.FrameData = function() {
        this._frames = [],
        this._frameNames = []
    }
    ,
    c.FrameData.prototype = {
        addFrame: function(a) {
            return a.index = this._frames.length,
            this._frames.push(a),
            "" !== a.name && (this._frameNames[a.name] = a.index),
            a
        },
        getFrame: function(a) {
            return a >= this._frames.length && (a = 0),
            this._frames[a]
        },
        getFrameByName: function(a) {
            return "number" == typeof this._frameNames[a] ? this._frames[this._frameNames[a]] : null
        },
        checkFrameName: function(a) {
            return null == this._frameNames[a] ? !1 : !0
        },
        clone: function() {
            for (var a = new c.FrameData, b = 0; b < this._frames.length; b++)
                a._frames.push(this._frames[b].clone());
            for (var d in this._frameNames)
                this._frameNames.hasOwnProperty(d) && a._frameNames.push(this._frameNames[d]);
            return a
        },
        getFrameRange: function(a, b, c) {
            void 0 === c && (c = []);
            for (var d = a; b >= d; d++)
                c.push(this._frames[d]);
            return c
        },
        getFrames: function(a, b, c) {
            if (void 0 === b && (b = !0),
            void 0 === c && (c = []),
            void 0 === a || 0 === a.length)
                for (var d = 0; d < this._frames.length; d++)
                    c.push(this._frames[d]);
            else
                for (var d = 0; d < a.length; d++)
                    c.push(b ? this.getFrame(a[d]) : this.getFrameByName(a[d]));
            return c
        },
        getFrameIndexes: function(a, b, c) {
            if (void 0 === b && (b = !0),
            void 0 === c && (c = []),
            void 0 === a || 0 === a.length)
                for (var d = 0; d < this._frames.length; d++)
                    c.push(this._frames[d].index);
            else
                for (var d = 0; d < a.length; d++)
                    b ? c.push(this._frames[a[d]].index) : this.getFrameByName(a[d]) && c.push(this.getFrameByName(a[d]).index);
            return c
        }
    },
    c.FrameData.prototype.constructor = c.FrameData,
    Object.defineProperty(c.FrameData.prototype, "total", {
        get: function() {
            return this._frames.length
        }
    }),
    c.AnimationParser = {
        spriteSheet: function(a, b, d, e, f, g, h) {
            var i = b;
            if ("string" == typeof b && (i = a.cache.getImage(b)),
            null === i)
                return null;
            var j = i.width
              , k = i.height;
            0 >= d && (d = Math.floor(-j / Math.min(-1, d))),
            0 >= e && (e = Math.floor(-k / Math.min(-1, e)));
            var l = Math.floor((j - g) / (d + h))
              , m = Math.floor((k - g) / (e + h))
              , n = l * m;
            if (-1 !== f && (n = f),
            0 === j || 0 === k || d > j || e > k || 0 === n)
                return console.warn("Phaser.AnimationParser.spriteSheet: '" + b + "'s width/height zero or width/height < given frameWidth/frameHeight"),
                null;
            for (var o = new c.FrameData, p = g, q = g, r = 0; n > r; r++)
                o.addFrame(new c.Frame(r,p,q,d,e,"")),
                p += d + h,
                p + d > j && (p = g,
                q += e + h);
            return o
        },
        JSONData: function(a, b) {
            if (!b.frames)
                return console.warn("Phaser.AnimationParser.JSONData: Invalid Texture Atlas JSON given, missing 'frames' array"),
                void console.log(b);
            for (var d, e = new c.FrameData, f = b.frames, g = 0; g < f.length; g++)
                d = e.addFrame(new c.Frame(g,f[g].frame.x,f[g].frame.y,f[g].frame.w,f[g].frame.h,f[g].filename)),
                f[g].trimmed && d.setTrim(f[g].trimmed, f[g].sourceSize.w, f[g].sourceSize.h, f[g].spriteSourceSize.x, f[g].spriteSourceSize.y, f[g].spriteSourceSize.w, f[g].spriteSourceSize.h);
            return e
        },
        JSONDataHash: function(a, b) {
            if (!b.frames)
                return console.warn("Phaser.AnimationParser.JSONDataHash: Invalid Texture Atlas JSON given, missing 'frames' object"),
                void console.log(b);
            var d, e = new c.FrameData, f = b.frames, g = 0;
            for (var h in f)
                d = e.addFrame(new c.Frame(g,f[h].frame.x,f[h].frame.y,f[h].frame.w,f[h].frame.h,h)),
                f[h].trimmed && d.setTrim(f[h].trimmed, f[h].sourceSize.w, f[h].sourceSize.h, f[h].spriteSourceSize.x, f[h].spriteSourceSize.y, f[h].spriteSourceSize.w, f[h].spriteSourceSize.h),
                g++;
            return e
        },
        XMLData: function(a, b) {
            if (!b.getElementsByTagName("TextureAtlas"))
                return void console.warn("Phaser.AnimationParser.XMLData: Invalid Texture Atlas XML given, missing <TextureAtlas> tag");
            for (var d, e, f, g, h, i, j, k, l, m, n, o = new c.FrameData, p = b.getElementsByTagName("SubTexture"), q = 0; q < p.length; q++)
                f = p[q].attributes,
                e = f.name.value,
                g = parseInt(f.x.value, 10),
                h = parseInt(f.y.value, 10),
                i = parseInt(f.width.value, 10),
                j = parseInt(f.height.value, 10),
                k = null,
                l = null,
                f.frameX && (k = Math.abs(parseInt(f.frameX.value, 10)),
                l = Math.abs(parseInt(f.frameY.value, 10)),
                m = parseInt(f.frameWidth.value, 10),
                n = parseInt(f.frameHeight.value, 10)),
                d = o.addFrame(new c.Frame(q,g,h,i,j,e)),
                (null !== k || null !== l) && d.setTrim(!0, i, j, k, l, m, n);
            return o
        }
    },
    c.Cache = function(a) {
        this.game = a,
        this.autoResolveURL = !1,
        this._cache = {
            canvas: {},
            image: {},
            texture: {},
            sound: {},
            video: {},
            text: {},
            json: {},
            xml: {},
            physics: {},
            tilemap: {},
            binary: {},
            bitmapData: {},
            bitmapFont: {},
            shader: {},
            renderTexture: {}
        },
        this._urlMap = {},
        this._urlResolver = new Image,
        this._urlTemp = null,
        this.onSoundUnlock = new c.Signal,
        this._cacheMap = [],
        this._cacheMap[c.Cache.CANVAS] = this._cache.canvas,
        this._cacheMap[c.Cache.IMAGE] = this._cache.image,
        this._cacheMap[c.Cache.TEXTURE] = this._cache.texture,
        this._cacheMap[c.Cache.SOUND] = this._cache.sound,
        this._cacheMap[c.Cache.TEXT] = this._cache.text,
        this._cacheMap[c.Cache.PHYSICS] = this._cache.physics,
        this._cacheMap[c.Cache.TILEMAP] = this._cache.tilemap,
        this._cacheMap[c.Cache.BINARY] = this._cache.binary,
        this._cacheMap[c.Cache.BITMAPDATA] = this._cache.bitmapData,
        this._cacheMap[c.Cache.BITMAPFONT] = this._cache.bitmapFont,
        this._cacheMap[c.Cache.JSON] = this._cache.json,
        this._cacheMap[c.Cache.XML] = this._cache.xml,
        this._cacheMap[c.Cache.VIDEO] = this._cache.video,
        this._cacheMap[c.Cache.SHADER] = this._cache.shader,
        this._cacheMap[c.Cache.RENDER_TEXTURE] = this._cache.renderTexture,
        this.addDefaultImage(),
        this.addMissingImage()
    }
    ,
    c.Cache.CANVAS = 1,
    c.Cache.IMAGE = 2,
    c.Cache.TEXTURE = 3,
    c.Cache.SOUND = 4,
    c.Cache.TEXT = 5,
    c.Cache.PHYSICS = 6,
    c.Cache.TILEMAP = 7,
    c.Cache.BINARY = 8,
    c.Cache.BITMAPDATA = 9,
    c.Cache.BITMAPFONT = 10,
    c.Cache.JSON = 11,
    c.Cache.XML = 12,
    c.Cache.VIDEO = 13,
    c.Cache.SHADER = 14,
    c.Cache.RENDER_TEXTURE = 15,
    c.Cache.prototype = {
        addCanvas: function(a, b, c) {
            void 0 === c && (c = b.getContext("2d")),
            this._cache.canvas[a] = {
                canvas: b,
                context: c
            }
        },
        addImage: function(a, b, d) {
            this.checkImageKey(a) && this.removeImage(a);
            var e = {
                key: a,
                url: b,
                data: d,
                base: new PIXI.BaseTexture(d),
                frame: new c.Frame(0,0,0,d.width,d.height,a),
                frameData: new c.FrameData
            };
            return e.frameData.addFrame(new c.Frame(0,0,0,d.width,d.height,b)),
            this._cache.image[a] = e,
            this._resolveURL(b, e),
            e
        },
        addDefaultImage: function() {
            var a = new Image;
            a.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg==";
            var b = this.addImage("__default", null, a);
            PIXI.TextureCache.__default = new PIXI.Texture(b.base)
        },
        addMissingImage: function() {
            var a = new Image;
            a.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==";
            var b = this.addImage("__missing", null, a);
            PIXI.TextureCache.__missing = new PIXI.Texture(b.base)
        },
        addSound: function(a, b, c, d, e) {
            void 0 === d && (d = !0,
            e = !1),
            void 0 === e && (d = !1,
            e = !0);
            var f = !1;
            e && (f = !0),
            this._cache.sound[a] = {
                url: b,
                data: c,
                isDecoding: !1,
                decoded: f,
                webAudio: d,
                audioTag: e,
                locked: this.game.sound.touchLocked
            },
            this._resolveURL(b, this._cache.sound[a])
        },
        addText: function(a, b, c) {
            this._cache.text[a] = {
                url: b,
                data: c
            },
            this._resolveURL(b, this._cache.text[a])
        },
        addPhysicsData: function(a, b, c, d) {
            this._cache.physics[a] = {
                url: b,
                data: c,
                format: d
            },
            this._resolveURL(b, this._cache.physics[a])
        },
        addTilemap: function(a, b, c, d) {
            this._cache.tilemap[a] = {
                url: b,
                data: c,
                format: d
            },
            this._resolveURL(b, this._cache.tilemap[a])
        },
        addBinary: function(a, b) {
            this._cache.binary[a] = b
        },
        addBitmapData: function(a, b, d) {
            return b.key = a,
            void 0 === d && (d = new c.FrameData,
            d.addFrame(b.textureFrame)),
            this._cache.bitmapData[a] = {
                data: b,
                frameData: d
            },
            b
        },
        addBitmapFont: function(a, b, d, e, f, g, h) {
            var i = {
                url: b,
                data: d,
                font: null,
                base: new PIXI.BaseTexture(d)
            };
            i.font = "json" === f ? c.LoaderParser.jsonBitmapFont(e, i.base, g, h) : c.LoaderParser.xmlBitmapFont(e, i.base, g, h),
            this._cache.bitmapFont[a] = i,
            this._resolveURL(b, i)
        },
        addJSON: function(a, b, c) {
            this._cache.json[a] = {
                url: b,
                data: c
            },
            this._resolveURL(b, this._cache.json[a])
        },
        addXML: function(a, b, c) {
            this._cache.xml[a] = {
                url: b,
                data: c
            },
            this._resolveURL(b, this._cache.xml[a])
        },
        addVideo: function(a, b, c, d) {
            this._cache.video[a] = {
                url: b,
                data: c,
                isBlob: d,
                locked: !0
            },
            this._resolveURL(b, this._cache.video[a])
        },
        addShader: function(a, b, c) {
            this._cache.shader[a] = {
                url: b,
                data: c
            },
            this._resolveURL(b, this._cache.shader[a])
        },
        addRenderTexture: function(a, b) {
            this._cache.renderTexture[a] = {
                texture: b,
                frame: new c.Frame(0,0,0,b.width,b.height,"","")
            }
        },
        addSpriteSheet: function(a, b, d, e, f, g, h, i) {
            void 0 === g && (g = -1),
            void 0 === h && (h = 0),
            void 0 === i && (i = 0);
            var j = {
                key: a,
                url: b,
                data: d,
                frameWidth: e,
                frameHeight: f,
                margin: h,
                spacing: i,
                base: new PIXI.BaseTexture(d),
                frameData: c.AnimationParser.spriteSheet(this.game, d, e, f, g, h, i)
            };
            this._cache.image[a] = j,
            this._resolveURL(b, j)
        },
        addTextureAtlas: function(a, b, d, e, f) {
            var g = {
                key: a,
                url: b,
                data: d,
                base: new PIXI.BaseTexture(d)
            };
            g.frameData = f === c.Loader.TEXTURE_ATLAS_XML_STARLING ? c.AnimationParser.XMLData(this.game, e, a) : Array.isArray(e.frames) ? c.AnimationParser.JSONData(this.game, e, a) : c.AnimationParser.JSONDataHash(this.game, e, a),
            this._cache.image[a] = g,
            this._resolveURL(b, g)
        },
        reloadSound: function(a) {
            var b = this
              , c = this.getSound(a);
            c && (c.data.src = c.url,
            c.data.addEventListener("canplaythrough", function() {
                return b.reloadSoundComplete(a)
            }, !1),
            c.data.load())
        },
        reloadSoundComplete: function(a) {
            var b = this.getSound(a);
            b && (b.locked = !1,
            this.onSoundUnlock.dispatch(a))
        },
        updateSound: function(a, b, c) {
            var d = this.getSound(a);
            d && (d[b] = c)
        },
        decodedSound: function(a, b) {
            var c = this.getSound(a);
            c.data = b,
            c.decoded = !0,
            c.isDecoding = !1
        },
        isSoundDecoded: function(a) {
            var b = this.getItem(a, c.Cache.SOUND, "isSoundDecoded");
            return b ? b.decoded : void 0
        },
        isSoundReady: function(a) {
            var b = this.getItem(a, c.Cache.SOUND, "isSoundDecoded");
            return b ? b.decoded && !this.game.sound.touchLocked : void 0
        },
        checkKey: function(a, b) {
            return this._cacheMap[a][b] ? !0 : !1
        },
        checkURL: function(a) {
            return this._urlMap[this._resolveURL(a)] ? !0 : !1
        },
        checkCanvasKey: function(a) {
            return this.checkKey(c.Cache.CANVAS, a)
        },
        checkImageKey: function(a) {
            return this.checkKey(c.Cache.IMAGE, a)
        },
        checkTextureKey: function(a) {
            return this.checkKey(c.Cache.TEXTURE, a)
        },
        checkSoundKey: function(a) {
            return this.checkKey(c.Cache.SOUND, a)
        },
        checkTextKey: function(a) {
            return this.checkKey(c.Cache.TEXT, a)
        },
        checkPhysicsKey: function(a) {
            return this.checkKey(c.Cache.PHYSICS, a)
        },
        checkTilemapKey: function(a) {
            return this.checkKey(c.Cache.TILEMAP, a)
        },
        checkBinaryKey: function(a) {
            return this.checkKey(c.Cache.BINARY, a)
        },
        checkBitmapDataKey: function(a) {
            return this.checkKey(c.Cache.BITMAPDATA, a)
        },
        checkBitmapFontKey: function(a) {
            return this.checkKey(c.Cache.BITMAPFONT, a)
        },
        checkJSONKey: function(a) {
            return this.checkKey(c.Cache.JSON, a)
        },
        checkXMLKey: function(a) {
            return this.checkKey(c.Cache.XML, a)
        },
        checkVideoKey: function(a) {
            return this.checkKey(c.Cache.VIDEO, a)
        },
        checkShaderKey: function(a) {
            return this.checkKey(c.Cache.SHADER, a)
        },
        checkRenderTextureKey: function(a) {
            return this.checkKey(c.Cache.RENDER_TEXTURE, a)
        },
        getItem: function(a, b, c, d) {
            return this.checkKey(b, a) ? void 0 === d ? this._cacheMap[b][a] : this._cacheMap[b][a][d] : (c && console.warn("Phaser.Cache." + c + ': Key "' + a + '" not found in Cache.'),
            null)
        },
        getCanvas: function(a) {
            return this.getItem(a, c.Cache.CANVAS, "getCanvas", "canvas")
        },
        getImage: function(a, b) {
            (void 0 === a || null === a) && (a = "__default"),
            void 0 === b && (b = !1);
            var d = this.getItem(a, c.Cache.IMAGE, "getImage");
            return null === d && (d = this.getItem("__missing", c.Cache.IMAGE, "getImage")),
            b ? d : d.data
        },
        getTextureFrame: function(a) {
            return this.getItem(a, c.Cache.TEXTURE, "getTextureFrame", "frame")
        },
        getSound: function(a) {
            return this.getItem(a, c.Cache.SOUND, "getSound")
        },
        getSoundData: function(a) {
            return this.getItem(a, c.Cache.SOUND, "getSoundData", "data")
        },
        getText: function(a) {
            return this.getItem(a, c.Cache.TEXT, "getText", "data")
        },
        getPhysicsData: function(a, b, d) {
            var e = this.getItem(a, c.Cache.PHYSICS, "getPhysicsData", "data");
            if (null === e || void 0 === b || null === b)
                return e;
            if (e[b]) {
                var f = e[b];
                if (!f || !d)
                    return f;
                for (var g in f)
                    if (g = f[g],
                    g.fixtureKey === d)
                        return g;
                console.warn('Phaser.Cache.getPhysicsData: Could not find given fixtureKey: "' + d + " in " + a + '"')
            } else
                console.warn('Phaser.Cache.getPhysicsData: Invalid key/object: "' + a + " / " + b + '"');
            return null
        },
        getTilemapData: function(a) {
            return this.getItem(a, c.Cache.TILEMAP, "getTilemapData")
        },
        getBinary: function(a) {
            return this.getItem(a, c.Cache.BINARY, "getBinary")
        },
        getBitmapData: function(a) {
            return this.getItem(a, c.Cache.BITMAPDATA, "getBitmapData", "data")
        },
        getBitmapFont: function(a) {
            return this.getItem(a, c.Cache.BITMAPFONT, "getBitmapFont")
        },
        getJSON: function(a, b) {
            var d = this.getItem(a, c.Cache.JSON, "getJSON", "data");
            return d ? b ? c.Utils.extend(!0, d) : d : null
        },
        getXML: function(a) {
            return this.getItem(a, c.Cache.XML, "getXML", "data")
        },
        getVideo: function(a) {
            return this.getItem(a, c.Cache.VIDEO, "getVideo")
        },
        getShader: function(a) {
            return this.getItem(a, c.Cache.SHADER, "getShader", "data")
        },
        getRenderTexture: function(a) {
            return this.getItem(a, c.Cache.RENDER_TEXTURE, "getRenderTexture")
        },
        getBaseTexture: function(a, b) {
            return void 0 === b && (b = c.Cache.IMAGE),
            this.getItem(a, b, "getBaseTexture", "base")
        },
        getFrame: function(a, b) {
            return void 0 === b && (b = c.Cache.IMAGE),
            this.getItem(a, b, "getFrame", "frame")
        },
        getFrameCount: function(a, b) {
            var c = this.getFrameData(a, b);
            return c ? c.total : 0
        },
        getFrameData: function(a, b) {
            return void 0 === b && (b = c.Cache.IMAGE),
            this.getItem(a, b, "getFrameData", "frameData")
        },
        hasFrameData: function(a, b) {
            return void 0 === b && (b = c.Cache.IMAGE),
            null !== this.getItem(a, b, "", "frameData")
        },
        updateFrameData: function(a, b, d) {
            void 0 === d && (d = c.Cache.IMAGE),
            this._cacheMap[d][a] && (this._cacheMap[d][a].frameData = b)
        },
        getFrameByIndex: function(a, b, c) {
            var d = this.getFrameData(a, c);
            return d ? d.getFrame(b) : null
        },
        getFrameByName: function(a, b, c) {
            var d = this.getFrameData(a, c);
            return d ? d.getFrameByName(b) : null
        },
        getPixiTexture: function(a) {
            if (PIXI.TextureCache[a])
                return PIXI.TextureCache[a];
            var b = this.getPixiBaseTexture(a);
            return b ? new PIXI.Texture(b) : null
        },
        getPixiBaseTexture: function(a) {
            if (PIXI.BaseTextureCache[a])
                return PIXI.BaseTextureCache[a];
            var b = this.getItem(a, c.Cache.IMAGE, "getPixiBaseTexture");
            return null !== b ? b.base : null
        },
        getURL: function(a) {
            var a = this._resolveURL(a);
            return a ? this._urlMap[a] : (console.warn('Phaser.Cache.getUrl: Invalid url: "' + a + '" or Cache.autoResolveURL was false'),
            null)
        },
        getKeys: function(a) {
            void 0 === a && (a = c.Cache.IMAGE);
            var b = [];
            if (this._cacheMap[a])
                for (var d in this._cacheMap[a])
                    "__default" !== d && "__missing" !== d && b.push(d);
            return b
        },
        removeCanvas: function(a) {
            delete this._cache.canvas[a]
        },
        removeImage: function(a, b) {
            void 0 === b && (b = !0);
            var c = this.getImage(a, !0);
            b && c.base && c.base.destroy(),
            delete this._cache.image[a]
        },
        removeSound: function(a) {
            delete this._cache.sound[a]
        },
        removeText: function(a) {
            delete this._cache.text[a]
        },
        removePhysics: function(a) {
            delete this._cache.physics[a]
        },
        removeTilemap: function(a) {
            delete this._cache.tilemap[a]
        },
        removeBinary: function(a) {
            delete this._cache.binary[a]
        },
        removeBitmapData: function(a) {
            delete this._cache.bitmapData[a]
        },
        removeBitmapFont: function(a) {
            delete this._cache.bitmapFont[a]
        },
        removeJSON: function(a) {
            delete this._cache.json[a]
        },
        removeXML: function(a) {
            delete this._cache.xml[a]
        },
        removeVideo: function(a) {
            delete this._cache.video[a]
        },
        removeShader: function(a) {
            delete this._cache.shader[a]
        },
        removeRenderTexture: function(a) {
            delete this._cache.renderTexture[a]
        },
        removeSpriteSheet: function(a) {
            delete this._cache.spriteSheet[a]
        },
        removeTextureAtlas: function(a) {
            delete this._cache.atlas[a]
        },
        clearGLTextures: function() {
            for (var a in this.cache.image)
                this.cache.image[a].base._glTextures = []
        },
        _resolveURL: function(a, b) {
            return this.autoResolveURL ? (this._urlResolver.src = this.game.load.baseURL + a,
            this._urlTemp = this._urlResolver.src,
            this._urlResolver.src = "",
            b && (this._urlMap[this._urlTemp] = b),
            this._urlTemp) : null
        },
        destroy: function() {
            for (var a = 0; a < this._cacheMap.length; a++) {
                var b = this._cacheMap[a];
                for (var c in b)
                    "__default" !== c && "__missing" !== c && (b[c].destroy && b[c].destroy(),
                    delete b[c])
            }
            this._urlMap = null,
            this._urlResolver = null,
            this._urlTemp = null
        }
    },
    c.Cache.prototype.constructor = c.Cache,
    c.Loader = function(a) {
        this.game = a,
        this.cache = a.cache,
        this.resetLocked = !1,
        this.isLoading = !1,
        this.hasLoaded = !1,
        this.preloadSprite = null,
        this.crossOrigin = !1,
        this.baseURL = "",
        this.path = "",
        this.onLoadStart = new c.Signal,
        this.onLoadComplete = new c.Signal,
        this.onPackComplete = new c.Signal,
        this.onFileStart = new c.Signal,
        this.onFileComplete = new c.Signal,
        this.onFileError = new c.Signal,
        this.useXDomainRequest = !1,
        this._warnedAboutXDomainRequest = !1,
        this.enableParallel = !0,
        this.maxParallelDownloads = 4,
        this._withSyncPointDepth = 0,
        this._fileList = [],
        this._flightQueue = [],
        this._processingHead = 0,
        this._fileLoadStarted = !1,
        this._totalPackCount = 0,
        this._totalFileCount = 0,
        this._loadedPackCount = 0,
        this._loadedFileCount = 0
    }
    ,
    c.Loader.TEXTURE_ATLAS_JSON_ARRAY = 0,
    c.Loader.TEXTURE_ATLAS_JSON_HASH = 1,
    c.Loader.TEXTURE_ATLAS_XML_STARLING = 2,
    c.Loader.PHYSICS_LIME_CORONA_JSON = 3,
    c.Loader.PHYSICS_PHASER_JSON = 4,
    c.Loader.prototype = {
        setPreloadSprite: function(a, b) {
            b = b || 0,
            this.preloadSprite = {
                sprite: a,
                direction: b,
                width: a.width,
                height: a.height,
                rect: null
            },
            this.preloadSprite.rect = 0 === b ? new c.Rectangle(0,0,1,a.height) : new c.Rectangle(0,0,a.width,1),
            a.crop(this.preloadSprite.rect),
            a.visible = !0
        },
        resize: function() {
            this.preloadSprite && this.preloadSprite.height !== this.preloadSprite.sprite.height && (this.preloadSprite.rect.height = this.preloadSprite.sprite.height)
        },
        checkKeyExists: function(a, b) {
            return this.getAssetIndex(a, b) > -1
        },
        getAssetIndex: function(a, b) {
            for (var c = -1, d = 0; d < this._fileList.length; d++) {
                var e = this._fileList[d];
                if (e.type === a && e.key === b && (c = d,
                !e.loaded && !e.loading))
                    break
            }
            return c
        },
        getAsset: function(a, b) {
            var c = this.getAssetIndex(a, b);
            return c > -1 ? {
                index: c,
                file: this._fileList[c]
            } : !1
        },
        reset: function(a, b) {
            void 0 === b && (b = !1),
            this.resetLocked || (a && (this.preloadSprite = null),
            this.isLoading = !1,
            this._processingHead = 0,
            this._fileList.length = 0,
            this._flightQueue.length = 0,
            this._fileLoadStarted = !1,
            this._totalFileCount = 0,
            this._totalPackCount = 0,
            this._loadedPackCount = 0,
            this._loadedFileCount = 0,
            b && (this.onLoadStart.removeAll(),
            this.onLoadComplete.removeAll(),
            this.onPackComplete.removeAll(),
            this.onFileStart.removeAll(),
            this.onFileComplete.removeAll(),
            this.onFileError.removeAll()))
        },
        addToFileList: function(a, b, c, d, e, f) {
            if (void 0 === e && (e = !1),
            void 0 === b || "" === b)
                return console.warn("Phaser.Loader: Invalid or no key given of type " + a),
                this;
            if (void 0 === c || null === c) {
                if (!f)
                    return console.warn("Phaser.Loader: No URL given for file type: " + a + " key: " + b),
                    this;
                c = b + f
            }
            var g = {
                type: a,
                key: b,
                path: this.path,
                url: c,
                syncPoint: this._withSyncPointDepth > 0,
                data: null,
                loading: !1,
                loaded: !1,
                error: !1
            };
            if (d)
                for (var h in d)
                    g[h] = d[h];
            var i = this.getAssetIndex(a, b);
            if (e && i > -1) {
                var j = this._fileList[i];
                j.loading || j.loaded ? (this._fileList.push(g),
                this._totalFileCount++) : this._fileList[i] = g
            } else
                -1 === i && (this._fileList.push(g),
                this._totalFileCount++);
            return this
        },
        replaceInFileList: function(a, b, c, d) {
            return this.addToFileList(a, b, c, d, !0)
        },
        pack: function(a, b, c, d) {
            if (void 0 === b && (b = null),
            void 0 === c && (c = null),
            void 0 === d && (d = null),
            !b && !c)
                return console.warn("Phaser.Loader.pack - Both url and data are null. One must be set."),
                this;
            var e = {
                type: "packfile",
                key: a,
                url: b,
                path: this.path,
                syncPoint: !0,
                data: null,
                loading: !1,
                loaded: !1,
                error: !1,
                callbackContext: d
            };
            c && ("string" == typeof c && (c = JSON.parse(c)),
            e.data = c || {},
            e.loaded = !0);
            for (var f = 0; f < this._fileList.length + 1; f++) {
                var g = this._fileList[f];
                if (!g || !g.loaded && !g.loading && "packfile" !== g.type) {
                    this._fileList.splice(f, 1, e),
                    this._totalPackCount++;
                    break
                }
            }
            return this
        },
        image: function(a, b, c) {
            return this.addToFileList("image", a, b, void 0, c, ".png")
        },
        images: function(a, b) {
            if (Array.isArray(b))
                for (var c = 0; c < a.length; c++)
                    this.image(a[c], b[c]);
            else
                for (var c = 0; c < a.length; c++)
                    this.image(a[c]);
            return this
        },
        text: function(a, b, c) {
            return this.addToFileList("text", a, b, void 0, c, ".txt")
        },
        json: function(a, b, c) {
            return this.addToFileList("json", a, b, void 0, c, ".json")
        },
        shader: function(a, b, c) {
            return this.addToFileList("shader", a, b, void 0, c, ".frag")
        },
        xml: function(a, b, c) {
            return this.addToFileList("xml", a, b, void 0, c, ".xml")
        },
        script: function(a, b, c, d) {
            return void 0 === c && (c = !1),
            c !== !1 && void 0 === d && (d = this),
            this.addToFileList("script", a, b, {
                syncPoint: !0,
                callback: c,
                callbackContext: d
            }, !1, ".js")
        },
        binary: function(a, b, c, d) {
            return void 0 === c && (c = !1),
            c !== !1 && void 0 === d && (d = c),
            this.addToFileList("binary", a, b, {
                callback: c,
                callbackContext: d
            }, !1, ".bin")
        },
        spritesheet: function(a, b, c, d, e, f, g) {
            return void 0 === e && (e = -1),
            void 0 === f && (f = 0),
            void 0 === g && (g = 0),
            this.addToFileList("spritesheet", a, b, {
                frameWidth: c,
                frameHeight: d,
                frameMax: e,
                margin: f,
                spacing: g
            }, !1, ".png")
        },
        audio: function(a, b, c) {
            return this.game.sound.noAudio ? this : (void 0 === c && (c = !0),
            "string" == typeof b && (b = [b]),
            this.addToFileList("audio", a, b, {
                buffer: null,
                autoDecode: c
            }))
        },
        audiosprite: function(a, b, c, d, e) {
            return this.game.sound.noAudio ? this : (void 0 === c && (c = null),
            void 0 === d && (d = null),
            void 0 === e && (e = !0),
            this.audio(a, b, e),
            c ? this.json(a + "-audioatlas", c) : d ? ("string" == typeof d && (d = JSON.parse(d)),
            this.cache.addJSON(a + "-audioatlas", "", d)) : console.warn("Phaser.Loader.audiosprite - You must specify either a jsonURL or provide a jsonData object"),
            this)
        },
        video: function(a, b, c, d) {
            return void 0 === c && (c = this.game.device.firefox ? "loadeddata" : "canplaythrough"),
            void 0 === d && (d = !1),
            "string" == typeof b && (b = [b]),
            this.addToFileList("video", a, b, {
                buffer: null,
                asBlob: d,
                loadEvent: c
            })
        },
        tilemap: function(a, b, d, e) {
            if (void 0 === b && (b = null),
            void 0 === d && (d = null),
            void 0 === e && (e = c.Tilemap.CSV),
            b || d || (b = e === c.Tilemap.CSV ? a + ".csv" : a + ".json"),
            d) {
                switch (e) {
                case c.Tilemap.CSV:
                    break;
                case c.Tilemap.TILED_JSON:
                    "string" == typeof d && (d = JSON.parse(d))
                }
                this.cache.addTilemap(a, null, d, e)
            } else
                this.addToFileList("tilemap", a, b, {
                    format: e
                });
            return this
        },
        physics: function(a, b, d, e) {
            return void 0 === b && (b = null),
            void 0 === d && (d = null),
            void 0 === e && (e = c.Physics.LIME_CORONA_JSON),
            b || d || (b = a + ".json"),
            d ? ("string" == typeof d && (d = JSON.parse(d)),
            this.cache.addPhysicsData(a, null, d, e)) : this.addToFileList("physics", a, b, {
                format: e
            }),
            this
        },
        bitmapFont: function(a, b, c, d, e, f) {
            if ((void 0 === b || null === b) && (b = a + ".png"),
            void 0 === c && (c = null),
            void 0 === d && (d = null),
            void 0 === e && (e = 0),
            void 0 === f && (f = 0),
            c)
                this.addToFileList("bitmapfont", a, b, {
                    atlasURL: c,
                    xSpacing: e,
                    ySpacing: f
                });
            else if ("string" == typeof d) {
                var g, h;
                try {
                    g = JSON.parse(d)
                } catch (i) {
                    h = this.parseXml(d)
                }
                if (!h && !g)
                    throw new Error("Phaser.Loader. Invalid Bitmap Font atlas given");
                this.addToFileList("bitmapfont", a, b, {
                    atlasURL: null,
                    atlasData: g || h,
                    atlasType: g ? "json" : "xml",
                    xSpacing: e,
                    ySpacing: f
                })
            }
            return this
        },
        atlasJSONArray: function(a, b, d, e) {
            return this.atlas(a, b, d, e, c.Loader.TEXTURE_ATLAS_JSON_ARRAY)
        },
        atlasJSONHash: function(a, b, d, e) {
            return this.atlas(a, b, d, e, c.Loader.TEXTURE_ATLAS_JSON_HASH)
        },
        atlasXML: function(a, b, d, e) {
            return void 0 === d && (d = null),
            void 0 === e && (e = null),
            d || e || (d = a + ".xml"),
            this.atlas(a, b, d, e, c.Loader.TEXTURE_ATLAS_XML_STARLING)
        },
        atlas: function(a, b, d, e, f) {
            if ((void 0 === b || null === b) && (b = a + ".png"),
            void 0 === d && (d = null),
            void 0 === e && (e = null),
            void 0 === f && (f = c.Loader.TEXTURE_ATLAS_JSON_ARRAY),
            d || e || (d = f === c.Loader.TEXTURE_ATLAS_XML_STARLING ? a + ".xml" : a + ".json"),
            d)
                this.addToFileList("textureatlas", a, b, {
                    atlasURL: d,
                    format: f
                });
            else {
                switch (f) {
                case c.Loader.TEXTURE_ATLAS_JSON_ARRAY:
                    "string" == typeof e && (e = JSON.parse(e));
                    break;
                case c.Loader.TEXTURE_ATLAS_XML_STARLING:
                    if ("string" == typeof e) {
                        var g = this.parseXml(e);
                        if (!g)
                            throw new Error("Phaser.Loader. Invalid Texture Atlas XML given");
                        e = g
                    }
                }
                this.addToFileList("textureatlas", a, b, {
                    atlasURL: null,
                    atlasData: e,
                    format: f
                })
            }
            return this
        },
        withSyncPoint: function(a, b) {
            this._withSyncPointDepth++;
            try {
                a.call(b || this, this)
            } finally {
                this._withSyncPointDepth--
            }
            return this
        },
        addSyncPoint: function(a, b) {
            var c = this.getAsset(a, b);
            return c && (c.file.syncPoint = !0),
            this
        },
        removeFile: function(a, b) {
            var c = this.getAsset(a, b);
            c && (c.loaded || c.loading || this._fileList.splice(c.index, 1))
        },
        removeAll: function() {
            this._fileList.length = 0,
            this._flightQueue.length = 0
        },
        start: function() {
            this.isLoading || (this.hasLoaded = !1,
            this.isLoading = !0,
            this.updateProgress(),
            this.processLoadQueue())
        },
        processLoadQueue: function() {
            if (!this.isLoading)
                return console.warn("Phaser.Loader - active loading canceled / reset"),
                void this.finishedLoading(!0);
            for (var a = 0; a < this._flightQueue.length; a++) {
                var b = this._flightQueue[a];
                (b.loaded || b.error) && (this._flightQueue.splice(a, 1),
                a--,
                b.loading = !1,
                b.requestUrl = null,
                b.requestObject = null,
                b.error && this.onFileError.dispatch(b.key, b),
                "packfile" !== b.type ? (this._loadedFileCount++,
                this.onFileComplete.dispatch(this.progress, b.key, !b.error, this._loadedFileCount, this._totalFileCount)) : "packfile" === b.type && b.error && (this._loadedPackCount++,
                this.onPackComplete.dispatch(b.key, !b.error, this._loadedPackCount, this._totalPackCount)))
            }
            for (var d = !1, e = this.enableParallel ? c.Math.clamp(this.maxParallelDownloads, 1, 12) : 1, a = this._processingHead; a < this._fileList.length; a++) {
                var b = this._fileList[a];
                if ("packfile" === b.type && !b.error && b.loaded && a === this._processingHead && (this.processPack(b),
                this._loadedPackCount++,
                this.onPackComplete.dispatch(b.key, !b.error, this._loadedPackCount, this._totalPackCount)),
                b.loaded || b.error ? a === this._processingHead && (this._processingHead = a + 1) : !b.loading && this._flightQueue.length < e && ("packfile" !== b.type || b.data ? d || (this._fileLoadStarted || (this._fileLoadStarted = !0,
                this.onLoadStart.dispatch()),
                this._flightQueue.push(b),
                b.loading = !0,
                this.onFileStart.dispatch(this.progress, b.key, b.url),
                this.loadFile(b)) : (this._flightQueue.push(b),
                b.loading = !0,
                this.loadFile(b))),
                !b.loaded && b.syncPoint && (d = !0),
                this._flightQueue.length >= e || d && this._loadedPackCount === this._totalPackCount)
                    break
            }
            if (this.updateProgress(),
            this._processingHead >= this._fileList.length)
                this.finishedLoading();
            else if (!this._flightQueue.length) {
                console.warn("Phaser.Loader - aborting: processing queue empty, loading may have stalled");
                var f = this;
                setTimeout(function() {
                    f.finishedLoading(!0)
                }, 2e3)
            }
        },
        finishedLoading: function(a) {
            this.hasLoaded || (this.hasLoaded = !0,
            this.isLoading = !1,
            a || this._fileLoadStarted || (this._fileLoadStarted = !0,
            this.onLoadStart.dispatch()),
            this.onLoadComplete.dispatch(),
            this.reset(),
            this.game.state.loadComplete())
        },
        asyncComplete: function(a, b) {
            void 0 === b && (b = ""),
            a.loaded = !0,
            a.error = !!b,
            b && (a.errorMessage = b,
            console.warn("Phaser.Loader - " + a.type + "[" + a.key + "]: " + b)),
            this.processLoadQueue()
        },
        processPack: function(a) {
            var b = a.data[a.key];
            if (!b)
                return void console.warn("Phaser.Loader - " + a.key + ": pack has data, but not for pack key");
            for (var d = 0; d < b.length; d++) {
                var e = b[d];
                switch (e.type) {
                case "image":
                    this.image(e.key, e.url, e.overwrite);
                    break;
                case "text":
                    this.text(e.key, e.url, e.overwrite);
                    break;
                case "json":
                    this.json(e.key, e.url, e.overwrite);
                    break;
                case "xml":
                    this.xml(e.key, e.url, e.overwrite);
                    break;
                case "script":
                    this.script(e.key, e.url, e.callback, a.callbackContext || this);
                    break;
                case "binary":
                    this.binary(e.key, e.url, e.callback, a.callbackContext || this);
                    break;
                case "spritesheet":
                    this.spritesheet(e.key, e.url, e.frameWidth, e.frameHeight, e.frameMax, e.margin, e.spacing);
                    break;
                case "video":
                    this.video(e.key, e.urls);
                    break;
                case "audio":
                    this.audio(e.key, e.urls, e.autoDecode);
                    break;
                case "audiosprite":
                    this.audiosprite(e.key, e.urls, e.jsonURL, e.jsonData, e.autoDecode);
                    break;
                case "tilemap":
                    this.tilemap(e.key, e.url, e.data, c.Tilemap[e.format]);
                    break;
                case "physics":
                    this.physics(e.key, e.url, e.data, c.Loader[e.format]);
                    break;
                case "bitmapFont":
                    this.bitmapFont(e.key, e.textureURL, e.atlasURL, e.atlasData, e.xSpacing, e.ySpacing);
                    break;
                case "atlasJSONArray":
                    this.atlasJSONArray(e.key, e.textureURL, e.atlasURL, e.atlasData);
                    break;
                case "atlasJSONHash":
                    this.atlasJSONHash(e.key, e.textureURL, e.atlasURL, e.atlasData);
                    break;
                case "atlasXML":
                    this.atlasXML(e.key, e.textureURL, e.atlasURL, e.atlasData);
                    break;
                case "atlas":
                    this.atlas(e.key, e.textureURL, e.atlasURL, e.atlasData, c.Loader[e.format]);
                    break;
                case "shader":
                    this.shader(e.key, e.url, e.overwrite)
                }
            }
        },
        transformUrl: function(a, b) {
            return a ? "http" === a.substr(0, 4) || "//" === a.substr(0, 2) ? a : this.baseURL + b.path + a : !1
        },
        loadFile: function(a) {
            switch (a.type) {
            case "packfile":
                this.xhrLoad(a, this.transformUrl(a.url, a), "text", this.fileComplete);
                break;
            case "image":
            case "spritesheet":
            case "textureatlas":
            case "bitmapfont":
                this.loadImageTag(a);
                break;
            case "audio":
                a.url = this.getAudioURL(a.url),
                a.url ? this.game.sound.usingWebAudio ? this.xhrLoad(a, this.transformUrl(a.url, a), "arraybuffer", this.fileComplete) : this.game.sound.usingAudioTag && this.loadAudioTag(a) : this.fileError(a, null, "No supported audio URL specified or device does not have audio playback support");
                break;
            case "video":
                a.url = this.getVideoURL(a.url),
                a.url ? a.asBlob ? this.xhrLoad(a, this.transformUrl(a.url, a), "arraybuffer", this.fileComplete) : this.loadVideoTag(a) : this.fileError(a, null, "No supported video URL specified or device does not have video playback support");
                break;
            case "json":
                this.xhrLoad(a, this.transformUrl(a.url, a), "text", this.jsonLoadComplete);
                break;
            case "xml":
                this.xhrLoad(a, this.transformUrl(a.url, a), "text", this.xmlLoadComplete);
                break;
            case "tilemap":
                a.format === c.Tilemap.TILED_JSON ? this.xhrLoad(a, this.transformUrl(a.url, a), "text", this.jsonLoadComplete) : a.format === c.Tilemap.CSV ? this.xhrLoad(a, this.transformUrl(a.url, a), "text", this.csvLoadComplete) : this.asyncComplete(a, "invalid Tilemap format: " + a.format);
                break;
            case "text":
            case "script":
            case "shader":
            case "physics":
                this.xhrLoad(a, this.transformUrl(a.url, a), "text", this.fileComplete);
                break;
            case "binary":
                this.xhrLoad(a, this.transformUrl(a.url, a), "arraybuffer", this.fileComplete)
            }
        },
        loadImageTag: function(a) {
            var b = this;
            a.data = new Image,
            a.data.name = a.key,
            this.crossOrigin && (a.data.crossOrigin = this.crossOrigin),
            a.data.onload = function() {
                a.data.onload && (a.data.onload = null,
                a.data.onerror = null,
                b.fileComplete(a))
            }
            ,
            a.data.onerror = function() {
                a.data.onload && (a.data.onload = null,
                a.data.onerror = null,
                b.fileError(a))
            }
            ,
            a.data.src = this.transformUrl(a.url, a),
            a.data.complete && a.data.width && a.data.height && (a.data.onload = null,
            a.data.onerror = null,
            this.fileComplete(a))
        },
        loadVideoTag: function(a) {
            var b = this;
            a.data = document.createElement("video"),
            a.data.name = a.key,
            a.data.controls = !1,
            a.data.autoplay = !1;
            var d = function() {
                a.data.removeEventListener(a.loadEvent, d, !1),
                a.data.onerror = null,
                a.data.canplay = !0,
                c.GAMES[b.game.id].load.fileComplete(a)
            };
            a.data.onerror = function() {
                a.data.removeEventListener(a.loadEvent, d, !1),
                a.data.onerror = null,
                a.data.canplay = !1,
                b.fileError(a)
            }
            ,
            a.data.addEventListener(a.loadEvent, d, !1),
            a.data.src = this.transformUrl(a.url, a),
            a.data.load()
        },
        loadAudioTag: function(a) {
            var b = this;
            if (this.game.sound.touchLocked)
                a.data = new Audio,
                a.data.name = a.key,
                a.data.preload = "auto",
                a.data.src = this.transformUrl(a.url, a),
                this.fileComplete(a);
            else {
                a.data = new Audio,
                a.data.name = a.key;
                var d = function() {
                    a.data.removeEventListener("canplaythrough", d, !1),
                    a.data.onerror = null,
                    c.GAMES[b.game.id].load.fileComplete(a)
                };
                a.data.onerror = function() {
                    a.data.removeEventListener("canplaythrough", d, !1),
                    a.data.onerror = null,
                    b.fileError(a)
                }
                ,
                a.data.preload = "auto",
                a.data.src = this.transformUrl(a.url, a),
                a.data.addEventListener("canplaythrough", d, !1),
                a.data.load()
            }
        },
        xhrLoad: function(a, b, c, d, e) {
            if (this.useXDomainRequest && window.XDomainRequest)
                return void this.xhrLoadWithXDR(a, b, c, d, e);
            var f = new XMLHttpRequest;
            f.open("GET", b, !0),
            f.responseType = c,
            e = e || this.fileError;
            var g = this;
            f.onload = function() {
                try {
                    return d.call(g, a, f)
                } catch (b) {
                    g.hasLoaded ? window.console && console.error(b) : g.asyncComplete(a, b.message || "Exception")
                }
            }
            ,
            f.onerror = function() {
                try {
                    return e.call(g, a, f)
                } catch (b) {
                    g.hasLoaded ? window.console && console.error(b) : g.asyncComplete(a, b.message || "Exception")
                }
            }
            ,
            a.requestObject = f,
            a.requestUrl = b,
            f.send()
        },
        xhrLoadWithXDR: function(a, b, c, d, e) {
            this._warnedAboutXDomainRequest || this.game.device.ie && !(this.game.device.ieVersion >= 10) || (this._warnedAboutXDomainRequest = !0,
            console.warn("Phaser.Loader - using XDomainRequest outside of IE 9"));
            var f = new window.XDomainRequest;
            f.open("GET", b, !0),
            f.responseType = c,
            f.timeout = 3e3,
            e = e || this.fileError;
            var g = this;
            f.onerror = function() {
                try {
                    return e.call(g, a, f)
                } catch (b) {
                    g.asyncComplete(a, b.message || "Exception")
                }
            }
            ,
            f.ontimeout = function() {
                try {
                    return e.call(g, a, f)
                } catch (b) {
                    g.asyncComplete(a, b.message || "Exception")
                }
            }
            ,
            f.onprogress = function() {}
            ,
            f.onload = function() {
                try {
                    return d.call(g, a, f)
                } catch (b) {
                    g.asyncComplete(a, b.message || "Exception")
                }
            }
            ,
            a.requestObject = f,
            a.requestUrl = b,
            setTimeout(function() {
                f.send()
            }, 0)
        },
        getVideoURL: function(a) {
            for (var b = 0; b < a.length; b++) {
                var c, d = a[b];
                if (d.uri)
                    d = d.uri,
                    c = d.type;
                else {
                    if (0 === d.indexOf("blob:") || 0 === d.indexOf("data:"))
                        return d;
                    d.indexOf("?") >= 0 && (d = d.substr(0, d.indexOf("?")));
                    var e = d.substr((Math.max(0, d.lastIndexOf(".")) || 1 / 0) + 1);
                    c = e.toLowerCase()
                }
                if (this.game.device.canPlayVideo(c))
                    return a[b]
            }
            return null
        },
        getAudioURL: function(a) {
            if (this.game.sound.noAudio)
                return null;
            for (var b = 0; b < a.length; b++) {
                var c, d = a[b];
                if (d.uri)
                    d = d.uri,
                    c = d.type;
                else {
                    if (0 === d.indexOf("blob:") || 0 === d.indexOf("data:"))
                        return d;
                    d.indexOf("?") >= 0 && (d = d.substr(0, d.indexOf("?")));
                    var e = d.substr((Math.max(0, d.lastIndexOf(".")) || 1 / 0) + 1);
                    c = e.toLowerCase()
                }
                if (this.game.device.canPlayAudio(c))
                    return a[b]
            }
            return null
        },
        fileError: function(a, b, c) {
            var d = a.requestUrl || this.transformUrl(a.url, a)
              , e = "error loading asset from URL " + d;
            !c && b && (c = b.status),
            c && (e = e + " (" + c + ")"),
            this.asyncComplete(a, e)
        },
        fileComplete: function(a, b) {
            var d = !0;
            switch (a.type) {
            case "packfile":
                var e = JSON.parse(b.responseText);
                a.data = e || {};
                break;
            case "image":
                this.cache.addImage(a.key, a.url, a.data);
                break;
            case "spritesheet":
                this.cache.addSpriteSheet(a.key, a.url, a.data, a.frameWidth, a.frameHeight, a.frameMax, a.margin, a.spacing);
                break;
            case "textureatlas":
                if (null == a.atlasURL)
                    this.cache.addTextureAtlas(a.key, a.url, a.data, a.atlasData, a.format);
                else if (d = !1,
                a.format == c.Loader.TEXTURE_ATLAS_JSON_ARRAY || a.format == c.Loader.TEXTURE_ATLAS_JSON_HASH)
                    this.xhrLoad(a, this.transformUrl(a.atlasURL, a), "text", this.jsonLoadComplete);
                else {
                    if (a.format != c.Loader.TEXTURE_ATLAS_XML_STARLING)
                        throw new Error("Phaser.Loader. Invalid Texture Atlas format: " + a.format);
                    this.xhrLoad(a, this.transformUrl(a.atlasURL, a), "text", this.xmlLoadComplete)
                }
                break;
            case "bitmapfont":
                a.atlasURL ? (d = !1,
                this.xhrLoad(a, this.transformUrl(a.atlasURL, a), "text", function(a, b) {
                    var c;
                    try {
                        c = JSON.parse(b.responseText)
                    } catch (d) {}
                    c ? (a.atlasType = "json",
                    this.jsonLoadComplete(a, b)) : (a.atlasType = "xml",
                    this.xmlLoadComplete(a, b))
                })) : this.cache.addBitmapFont(a.key, a.url, a.data, a.atlasData, a.atlasType, a.xSpacing, a.ySpacing);
                break;
            case "video":
                if (a.asBlob)
                    try {
                        a.data = new Blob([new Uint8Array(b.response)])
                    } catch (f) {
                        throw new Error("Phaser.Loader. Unable to parse video file as Blob: " + a.key)
                    }
                this.cache.addVideo(a.key, a.url, a.data, a.asBlob);
                break;
            case "audio":
                this.game.sound.usingWebAudio ? (a.data = b.response,
                this.cache.addSound(a.key, a.url, a.data, !0, !1),
                a.autoDecode && this.game.sound.decode(a.key)) : this.cache.addSound(a.key, a.url, a.data, !1, !0);
                break;
            case "text":
                a.data = b.responseText,
                this.cache.addText(a.key, a.url, a.data);
                break;
            case "shader":
                a.data = b.responseText,
                this.cache.addShader(a.key, a.url, a.data);
                break;
            case "physics":
                var e = JSON.parse(b.responseText);
                this.cache.addPhysicsData(a.key, a.url, e, a.format);
                break;
            case "script":
                a.data = document.createElement("script"),
                a.data.language = "javascript",
                a.data.type = "text/javascript",
                a.data.defer = !1,
                a.data.text = b.responseText,
                document.head.appendChild(a.data),
                a.callback && (a.data = a.callback.call(a.callbackContext, a.key, b.responseText));
                break;
            case "binary":
                a.data = a.callback ? a.callback.call(a.callbackContext, a.key, b.response) : b.response,
                this.cache.addBinary(a.key, a.data)
            }
            d && this.asyncComplete(a)
        },
        jsonLoadComplete: function(a, b) {
            var c = JSON.parse(b.responseText);
            "tilemap" === a.type ? this.cache.addTilemap(a.key, a.url, c, a.format) : "bitmapfont" === a.type ? this.cache.addBitmapFont(a.key, a.url, a.data, c, a.atlasType, a.xSpacing, a.ySpacing) : "json" === a.type ? this.cache.addJSON(a.key, a.url, c) : this.cache.addTextureAtlas(a.key, a.url, a.data, c, a.format),
            this.asyncComplete(a)
        },
        csvLoadComplete: function(a, b) {
            var c = b.responseText;
            this.cache.addTilemap(a.key, a.url, c, a.format),
            this.asyncComplete(a)
        },
        xmlLoadComplete: function(a, b) {
            var c = b.responseText
              , d = this.parseXml(c);
            if (!d) {
                var e = b.responseType || b.contentType;
                return console.warn("Phaser.Loader - " + a.key + ": invalid XML (" + e + ")"),
                void this.asyncComplete(a, "invalid XML")
            }
            "bitmapfont" === a.type ? this.cache.addBitmapFont(a.key, a.url, a.data, d, a.atlasType, a.xSpacing, a.ySpacing) : "textureatlas" === a.type ? this.cache.addTextureAtlas(a.key, a.url, a.data, d, a.format) : "xml" === a.type && this.cache.addXML(a.key, a.url, d),
            this.asyncComplete(a)
        },
        parseXml: function(a) {
            var b;
            try {
                if (window.DOMParser) {
                    var c = new DOMParser;
                    b = c.parseFromString(a, "text/xml")
                } else
                    b = new ActiveXObject("Microsoft.XMLDOM"),
                    b.async = "false",
                    b.loadXML(a)
            } catch (d) {
                b = null
            }
            return b && b.documentElement && !b.getElementsByTagName("parsererror").length ? b : null
        },
        updateProgress: function() {
            this.preloadSprite && (0 === this.preloadSprite.direction ? this.preloadSprite.rect.width = Math.floor(this.preloadSprite.width / 100 * this.progress) : this.preloadSprite.rect.height = Math.floor(this.preloadSprite.height / 100 * this.progress),
            this.preloadSprite.sprite ? this.preloadSprite.sprite.updateCrop() : this.preloadSprite = null)
        },
        totalLoadedFiles: function() {
            return this._loadedFileCount
        },
        totalQueuedFiles: function() {
            return this._totalFileCount - this._loadedFileCount
        },
        totalLoadedPacks: function() {
            return this._totalPackCount
        },
        totalQueuedPacks: function() {
            return this._totalPackCount - this._loadedPackCount
        }
    },
    Object.defineProperty(c.Loader.prototype, "progressFloat", {
        get: function() {
            var a = this._loadedFileCount / this._totalFileCount * 100;
            return c.Math.clamp(a || 0, 0, 100)
        }
    }),
    Object.defineProperty(c.Loader.prototype, "progress", {
        get: function() {
            return Math.round(this.progressFloat)
        }
    }),
    c.Loader.prototype.constructor = c.Loader,
    c.LoaderParser = {
        bitmapFont: function(a, b, c, d) {
            return this.xmlBitmapFont(a, b, c, d)
        },
        xmlBitmapFont: function(a, b, c, d) {
            var e = {}
              , f = a.getElementsByTagName("info")[0]
              , g = a.getElementsByTagName("common")[0];
            e.font = f.getAttribute("face"),
            e.size = parseInt(f.getAttribute("size"), 10),
            e.lineHeight = parseInt(g.getAttribute("lineHeight"), 10) + d,
            e.chars = {};
            for (var h = a.getElementsByTagName("char"), i = 0; i < h.length; i++) {
                var j = parseInt(h[i].getAttribute("id"), 10);
                e.chars[j] = {
                    x: parseInt(h[i].getAttribute("x"), 10),
                    y: parseInt(h[i].getAttribute("y"), 10),
                    width: parseInt(h[i].getAttribute("width"), 10),
                    height: parseInt(h[i].getAttribute("height"), 10),
                    xOffset: parseInt(h[i].getAttribute("xoffset"), 10),
                    yOffset: parseInt(h[i].getAttribute("yoffset"), 10),
                    xAdvance: parseInt(h[i].getAttribute("xadvance"), 10) + c,
                    kerning: {}
                }
            }
            var k = a.getElementsByTagName("kerning");
            for (i = 0; i < k.length; i++) {
                var l = parseInt(k[i].getAttribute("first"), 10)
                  , m = parseInt(k[i].getAttribute("second"), 10)
                  , n = parseInt(k[i].getAttribute("amount"), 10);
                e.chars[m].kerning[l] = n
            }
            return this.finalizeBitmapFont(b, e)
        },
        jsonBitmapFont: function(a, b, c, d) {
            var e = {
                font: a.font.info._face,
                size: parseInt(a.font.info._size, 10),
                lineHeight: parseInt(a.font.common._lineHeight, 10) + d,
                chars: {}
            };
            return a.font.chars["char"].forEach(function(a) {
                var b = parseInt(a._id, 10);
                e.chars[b] = {
                    x: parseInt(a._x, 10),
                    y: parseInt(a._y, 10),
                    width: parseInt(a._width, 10),
                    height: parseInt(a._height, 10),
                    xOffset: parseInt(a._xoffset, 10),
                    yOffset: parseInt(a._yoffset, 10),
                    xAdvance: parseInt(a._xadvance, 10) + c,
                    kerning: {}
                }
            }),
            a.font.kernings && a.font.kernings.kerning && a.font.kernings.kerning.forEach(function(a) {
                e.chars[a._second].kerning[a._first] = parseInt(a._amount, 10)
            }),
            this.finalizeBitmapFont(b, e)
        },
        finalizeBitmapFont: function(a, b) {
            return Object.keys(b.chars).forEach(function(d) {
                var e = b.chars[d];
                e.texture = new PIXI.Texture(a,new c.Rectangle(e.x,e.y,e.width,e.height))
            }),
            b
        }
    },
    c.AudioSprite = function(a, b) {
        this.game = a,
        this.key = b,
        this.config = this.game.cache.getJSON(b + "-audioatlas"),
        this.autoplayKey = null,
        this.autoplay = !1,
        this.sounds = {};
        for (var c in this.config.spritemap) {
            var d = this.config.spritemap[c]
              , e = this.game.add.sound(this.key);
            e.addMarker(c, d.start, d.end - d.start, null, d.loop),
            this.sounds[c] = e
        }
        this.config.autoplay && (this.autoplayKey = this.config.autoplay,
        this.play(this.autoplayKey),
        this.autoplay = this.sounds[this.autoplayKey])
    }
    ,
    c.AudioSprite.prototype = {
        play: function(a, b) {
            return void 0 === b && (b = 1),
            this.sounds[a].play(a, null, b)
        },
        stop: function(a) {
            if (a)
                this.sounds[a].stop();
            else
                for (var b in this.sounds)
                    this.sounds[b].stop()
        },
        get: function(a) {
            return this.sounds[a]
        }
    },
    c.AudioSprite.prototype.constructor = c.AudioSprite,
    c.Sound = function(a, b, d, e, f) {
        void 0 === d && (d = 1),
        void 0 === e && (e = !1),
        void 0 === f && (f = a.sound.connectToMaster),
        this.game = a,
        this.name = b,
        this.key = b,
        this.loop = e,
        this.volume = d,
        this.markers = {},
        this.context = null,
        this.autoplay = !1,
        this.totalDuration = 0,
        this.startTime = 0,
        this.currentTime = 0,
        this.duration = 0,
        this.durationMS = 0,
        this.position = 0,
        this.stopTime = 0,
        this.paused = !1,
        this.pausedPosition = 0,
        this.pausedTime = 0,
        this.isPlaying = !1,
        this.currentMarker = "",
        this.fadeTween = null,
        this.pendingPlayback = !1,
        this.override = !1,
        this.allowMultiple = !1,
        this.usingWebAudio = this.game.sound.usingWebAudio,
        this.usingAudioTag = this.game.sound.usingAudioTag,
        this.externalNode = null,
        this.masterGainNode = null,
        this.gainNode = null,
        this._sound = null,
        this.usingWebAudio ? (this.context = this.game.sound.context,
        this.masterGainNode = this.game.sound.masterGain,
        this.gainNode = void 0 === this.context.createGain ? this.context.createGainNode() : this.context.createGain(),
        this.gainNode.gain.value = d * this.game.sound.volume,
        f && this.gainNode.connect(this.masterGainNode)) : this.usingAudioTag && (this.game.cache.getSound(b) && this.game.cache.isSoundReady(b) ? (this._sound = this.game.cache.getSoundData(b),
        this.totalDuration = 0,
        this._sound.duration && (this.totalDuration = this._sound.duration)) : this.game.cache.onSoundUnlock.add(this.soundHasUnlocked, this)),
        this.onDecoded = new c.Signal,
        this.onPlay = new c.Signal,
        this.onPause = new c.Signal,
        this.onResume = new c.Signal,
        this.onLoop = new c.Signal,
        this.onStop = new c.Signal,
        this.onMute = new c.Signal,
        this.onMarkerComplete = new c.Signal,
        this.onFadeComplete = new c.Signal,
        this._volume = d,
        this._buffer = null,
        this._muted = !1,
        this._tempMarker = 0,
        this._tempPosition = 0,
        this._tempVolume = 0,
        this._muteVolume = 0,
        this._tempLoop = 0,
        this._paused = !1,
        this._onDecodedEventDispatched = !1
    }
    ,
    c.Sound.prototype = {
        soundHasUnlocked: function(a) {
            a === this.key && (this._sound = this.game.cache.getSoundData(this.key),
            this.totalDuration = this._sound.duration)
        },
        addMarker: function(a, b, c, d, e) {
            (void 0 === d || null === d) && (d = 1),
            void 0 === e && (e = !1),
            this.markers[a] = {
                name: a,
                start: b,
                stop: b + c,
                volume: d,
                duration: c,
                durationMS: 1e3 * c,
                loop: e
            }
        },
        removeMarker: function(a) {
            delete this.markers[a]
        },
        onEndedHandler: function() {
            this.isPlaying = !1,
            this.stop()
        },
        update: function() {
            return this.game.cache.checkSoundKey(this.key) ? (this.isDecoded && !this._onDecodedEventDispatched && (this.onDecoded.dispatch(this),
            this._onDecodedEventDispatched = !0),
            this.pendingPlayback && this.game.cache.isSoundReady(this.key) && (this.pendingPlayback = !1,
            this.play(this._tempMarker, this._tempPosition, this._tempVolume, this._tempLoop)),
            void (this.isPlaying && (this.currentTime = this.game.time.time - this.startTime,
            this.currentTime >= this.durationMS && (this.usingWebAudio ? this.loop ? (this.onLoop.dispatch(this),
            "" === this.currentMarker ? (this.currentTime = 0,
            this.startTime = this.game.time.time) : (this.onMarkerComplete.dispatch(this.currentMarker, this),
            this.play(this.currentMarker, 0, this.volume, !0, !0))) : "" !== this.currentMarker && this.stop() : this.loop ? (this.onLoop.dispatch(this),
            this.play(this.currentMarker, 0, this.volume, !0, !0)) : this.stop())))) : void this.destroy()
        },
        loopFull: function(a) {
            this.play(null, 0, a, !0)
        },
        play: function(a, b, c, d, e) {
            if ((void 0 === a || a === !1 || null === a) && (a = ""),
            void 0 === e && (e = !0),
            this.isPlaying && !this.allowMultiple && !e && !this.override)
                return this;
            if (this._sound && this.isPlaying && !this.allowMultiple && (this.override || e))
                if (this.usingWebAudio)
                    if (this._sound.disconnect(this.externalNode ? this.externalNode : this.gainNode),
                    void 0 === this._sound.stop)
                        this._sound.noteOff(0);
                    else
                        try {
                            this._sound.stop(0)
                        } catch (f) {}
                else
                    this.usingAudioTag && (this._sound.pause(),
                    this._sound.currentTime = 0);
            if ("" === a && Object.keys(this.markers).length > 0)
                return this;
            if ("" !== a) {
                if (this.currentMarker = a,
                !this.markers[a])
                    return this;
                this.position = this.markers[a].start,
                this.volume = this.markers[a].volume,
                this.loop = this.markers[a].loop,
                this.duration = this.markers[a].duration,
                this.durationMS = this.markers[a].durationMS,
                "undefined" != typeof c && (this.volume = c),
                "undefined" != typeof d && (this.loop = d),
                this._tempMarker = a,
                this._tempPosition = this.position,
                this._tempVolume = this.volume,
                this._tempLoop = this.loop
            } else
                b = b || 0,
                void 0 === c && (c = this._volume),
                void 0 === d && (d = this.loop),
                this.position = b,
                this.volume = c,
                this.loop = d,
                this.duration = 0,
                this.durationMS = 0,
                this._tempMarker = a,
                this._tempPosition = b,
                this._tempVolume = c,
                this._tempLoop = d;
            return this.usingWebAudio ? this.game.cache.isSoundDecoded(this.key) ? (this._sound = this.context.createBufferSource(),
            this._sound.connect(this.externalNode ? this.externalNode : this.gainNode),
            this._buffer = this.game.cache.getSoundData(this.key),
            this._sound.buffer = this._buffer,
            this.loop && "" === a && (this._sound.loop = !0),
            this.loop || "" !== a || (this._sound.onended = this.onEndedHandler.bind(this)),
            this.totalDuration = this._sound.buffer.duration,
            0 === this.duration && (this.duration = this.totalDuration,
            this.durationMS = Math.ceil(1e3 * this.totalDuration)),
            void 0 === this._sound.start ? this._sound.noteGrainOn(0, this.position, this.duration) : this.loop && "" === a ? this._sound.start(0, 0) : this._sound.start(0, this.position, this.duration),
            this.isPlaying = !0,
            this.startTime = this.game.time.time,
            this.currentTime = 0,
            this.stopTime = this.startTime + this.durationMS,
            this.onPlay.dispatch(this)) : (this.pendingPlayback = !0,
            this.game.cache.getSound(this.key) && this.game.cache.getSound(this.key).isDecoding === !1 && this.game.sound.decode(this.key, this)) : this.game.cache.getSound(this.key) && this.game.cache.getSound(this.key).locked ? (this.game.cache.reloadSound(this.key),
            this.pendingPlayback = !0) : this._sound && (this.game.device.cocoonJS || 4 === this._sound.readyState) ? (this._sound.play(),
            this.totalDuration = this._sound.duration,
            0 === this.duration && (this.duration = this.totalDuration,
            this.durationMS = 1e3 * this.totalDuration),
            this._sound.currentTime = this.position,
            this._sound.muted = this._muted,
            this._sound.volume = this._muted ? 0 : this._volume,
            this.isPlaying = !0,
            this.startTime = this.game.time.time,
            this.currentTime = 0,
            this.stopTime = this.startTime + this.durationMS,
            this.onPlay.dispatch(this)) : this.pendingPlayback = !0,
            this
        },
        restart: function(a, b, c, d) {
            a = a || "",
            b = b || 0,
            c = c || 1,
            void 0 === d && (d = !1),
            this.play(a, b, c, d, !0)
        },
        pause: function() {
            this.isPlaying && this._sound && (this.paused = !0,
            this.pausedPosition = this.currentTime,
            this.pausedTime = this.game.time.time,
            this.onPause.dispatch(this),
            this.stop())
        },
        resume: function() {
            if (this.paused && this._sound) {
                if (this.usingWebAudio) {
                    var a = this.position + this.pausedPosition / 1e3;
                    this._sound = this.context.createBufferSource(),
                    this._sound.buffer = this._buffer,
                    this._sound.connect(this.externalNode ? this.externalNode : this.gainNode),
                    this.loop && (this._sound.loop = !0),
                    this.loop || "" !== this.currentMarker || (this._sound.onended = this.onEndedHandler.bind(this));
                    var b = this.duration - this.pausedPosition / 1e3;
                    void 0 === this._sound.start ? this._sound.noteGrainOn(0, a, b) : this.loop && this.game.device.chrome ? 42 === this.game.device.chromeVersion ? this._sound.start(0) : this._sound.start(0, a) : this._sound.start(0, a, b)
                } else
                    this._sound.play();
                this.isPlaying = !0,
                this.paused = !1,
                this.startTime += this.game.time.time - this.pausedTime,
                this.onResume.dispatch(this)
            }
        },
        stop: function() {
            if (this.isPlaying && this._sound)
                if (this.usingWebAudio)
                    if (this._sound.disconnect(this.externalNode ? this.externalNode : this.gainNode),
                    void 0 === this._sound.stop)
                        this._sound.noteOff(0);
                    else
                        try {
                            this._sound.stop(0)
                        } catch (a) {}
                else
                    this.usingAudioTag && (this._sound.pause(),
                    this._sound.currentTime = 0);
            this.pendingPlayback = !1,
            this.isPlaying = !1;
            var b = this.currentMarker;
            "" !== this.currentMarker && this.onMarkerComplete.dispatch(this.currentMarker, this),
            this.currentMarker = "",
            null !== this.fadeTween && this.fadeTween.stop(),
            this.paused || this.onStop.dispatch(this, b)
        },
        fadeIn: function(a, b, c) {
            void 0 === b && (b = !1),
            void 0 === c && (c = this.currentMarker),
            this.paused || (this.play(c, 0, 0, b),
            this.fadeTo(a, 1))
        },
        fadeOut: function(a) {
            this.fadeTo(a, 0)
        },
        fadeTo: function(a, b) {
            if (this.isPlaying && !this.paused && b !== this.volume) {
                if (void 0 === a && (a = 1e3),
                void 0 === b)
                    return void console.warn("Phaser.Sound.fadeTo: No Volume Specified.");
                this.fadeTween = this.game.add.tween(this).to({
                    volume: b
                }, a, c.Easing.Linear.None, !0),
                this.fadeTween.onComplete.add(this.fadeComplete, this)
            }
        },
        fadeComplete: function() {
            this.onFadeComplete.dispatch(this, this.volume),
            0 === this.volume && this.stop()
        },
        destroy: function(a) {
            void 0 === a && (a = !0),
            this.stop(),
            a ? this.game.sound.remove(this) : (this.markers = {},
            this.context = null,
            this._buffer = null,
            this.externalNode = null,
            this.onDecoded.dispose(),
            this.onPlay.dispose(),
            this.onPause.dispose(),
            this.onResume.dispose(),
            this.onLoop.dispose(),
            this.onStop.dispose(),
            this.onMute.dispose(),
            this.onMarkerComplete.dispose())
        }
    },
    c.Sound.prototype.constructor = c.Sound,
    Object.defineProperty(c.Sound.prototype, "isDecoding", {
        get: function() {
            return this.game.cache.getSound(this.key).isDecoding
        }
    }),
    Object.defineProperty(c.Sound.prototype, "isDecoded", {
        get: function() {
            return this.game.cache.isSoundDecoded(this.key)
        }
    }),
    Object.defineProperty(c.Sound.prototype, "mute", {
        get: function() {
            return this._muted || this.game.sound.mute
        },
        set: function(a) {
            a = a || !1,
            a !== this._muted && (a ? (this._muted = !0,
            this._muteVolume = this._tempVolume,
            this.usingWebAudio ? this.gainNode.gain.value = 0 : this.usingAudioTag && this._sound && (this._sound.volume = 0)) : (this._muted = !1,
            this.usingWebAudio ? this.gainNode.gain.value = this._muteVolume : this.usingAudioTag && this._sound && (this._sound.volume = this._muteVolume)),
            this.onMute.dispatch(this))
        }
    }),
    Object.defineProperty(c.Sound.prototype, "volume", {
        get: function() {
            return this._volume
        },
        set: function(a) {
            return this.game.device.firefox && this.usingAudioTag && (a = this.game.math.clamp(a, 0, 1)),
            this._muted ? void (this._muteVolume = a) : (this._tempVolume = a,
            this._volume = a,
            void (this.usingWebAudio ? this.gainNode.gain.value = a : this.usingAudioTag && this._sound && (this._sound.volume = a)))
        }
    }),
    c.SoundManager = function(a) {
        this.game = a,
        this.onSoundDecode = new c.Signal,
        this.onVolumeChange = new c.Signal,
        this.onMute = new c.Signal,
        this.onUnMute = new c.Signal,
        this.context = null,
        this.usingWebAudio = !1,
        this.usingAudioTag = !1,
        this.noAudio = !1,
        this.connectToMaster = !0,
        this.touchLocked = !1,
        this.channels = 32,
        this._codeMuted = !1,
        this._muted = !1,
        this._unlockSource = null,
        this._volume = 1,
        this._sounds = [],
        this._watchList = new c.ArraySet,
        this._watching = !1,
        this._watchCallback = null,
        this._watchContext = null
    }
    ,
    c.SoundManager.prototype = {
        boot: function() {
            if (this.game.device.iOS && this.game.device.webAudio === !1 && (this.channels = 1),
            window.PhaserGlobal) {
                if (window.PhaserGlobal.disableAudio === !0)
                    return this.noAudio = !0,
                    void (this.touchLocked = !1);
                if (window.PhaserGlobal.disableWebAudio === !0)
                    return this.usingAudioTag = !0,
                    void (this.touchLocked = !1)
            }
            if (window.PhaserGlobal && window.PhaserGlobal.audioContext)
                this.context = window.PhaserGlobal.audioContext;
            else if (window.AudioContext)
                try {
                    this.context = new window.AudioContext
                } catch (a) {
                    this.context = null,
                    this.usingWebAudio = !1,
                    this.touchLocked = !1
                }
            else if (window.webkitAudioContext)
                try {
                    this.context = new window.webkitAudioContext
                } catch (a) {
                    this.context = null,
                    this.usingWebAudio = !1,
                    this.touchLocked = !1
                }
            if (null === this.context) {
                if (void 0 === window.Audio)
                    return void (this.noAudio = !0);
                this.usingAudioTag = !0
            } else
                this.usingWebAudio = !0,
                this.masterGain = void 0 === this.context.createGain ? this.context.createGainNode() : this.context.createGain(),
                this.masterGain.gain.value = 1,
                this.masterGain.connect(this.context.destination);
            this.noAudio || (!this.game.device.cocoonJS && this.game.device.iOS || window.PhaserGlobal && window.PhaserGlobal.fakeiOSTouchLock) && this.setTouchLock()
        },
        setTouchLock: function() {
            this.game.input.touch.addTouchLockCallback(this.unlock, this),
            this.touchLocked = !0
        },
        unlock: function() {
            if (this.noAudio || !this.touchLocked || null !== this._unlockSource)
                return !0;
            if (this.usingAudioTag)
                this.touchLocked = !1,
                this._unlockSource = null;
            else if (this.usingWebAudio) {
                var a = this.context.createBuffer(1, 1, 22050);
                this._unlockSource = this.context.createBufferSource(),
                this._unlockSource.buffer = a,
                this._unlockSource.connect(this.context.destination),
                void 0 === this._unlockSource.start ? this._unlockSource.noteOn(0) : this._unlockSource.start(0)
            }
            return !0
        },
        stopAll: function() {
            if (!this.noAudio)
                for (var a = 0; a < this._sounds.length; a++)
                    this._sounds[a] && this._sounds[a].stop()
        },
        pauseAll: function() {
            if (!this.noAudio)
                for (var a = 0; a < this._sounds.length; a++)
                    this._sounds[a] && this._sounds[a].pause()
        },
        resumeAll: function() {
            if (!this.noAudio)
                for (var a = 0; a < this._sounds.length; a++)
                    this._sounds[a] && this._sounds[a].resume()
        },
        decode: function(a, b) {
            b = b || null;
            var c = this.game.cache.getSoundData(a);
            if (c && this.game.cache.isSoundDecoded(a) === !1) {
                this.game.cache.updateSound(a, "isDecoding", !0);
                var d = this;
                try {
                    this.context.decodeAudioData(c, function(c) {
                        c && (d.game.cache.decodedSound(a, c),
                        d.onSoundDecode.dispatch(a, b))
                    })
                } catch (e) {}
            }
        },
        setDecodedCallback: function(a, b, d) {
            "string" == typeof a && (a = [a]),
            this._watchList.reset();
            for (var e = 0; e < a.length; e++)
                a[e]instanceof c.Sound ? this.game.cache.isSoundDecoded(a[e].key) || this._watchList.add(a[e].key) : this.game.cache.isSoundDecoded(a[e]) || this._watchList.add(a[e]);
            0 === this._watchList.total ? (this._watching = !1,
            b.call(d)) : (this._watching = !0,
            this._watchCallback = b,
            this._watchContext = d)
        },
        update: function() {
            if (!this.noAudio) {
                !this.touchLocked || null === this._unlockSource || this._unlockSource.playbackState !== this._unlockSource.PLAYING_STATE && this._unlockSource.playbackState !== this._unlockSource.FINISHED_STATE || (this.touchLocked = !1,
                this._unlockSource = null);
                for (var a = 0; a < this._sounds.length; a++)
                    this._sounds[a].update();
                if (this._watching) {
                    for (var b = this._watchList.first; b; )
                        this.game.cache.isSoundDecoded(b) && this._watchList.remove(b),
                        b = this._watchList.next;
                    0 === this._watchList.total && (this._watching = !1,
                    this._watchCallback.call(this._watchContext))
                }
            }
        },
        add: function(a, b, d, e) {
            void 0 === b && (b = 1),
            void 0 === d && (d = !1),
            void 0 === e && (e = this.connectToMaster);
            var f = new c.Sound(this.game,a,b,d,e);
            return this._sounds.push(f),
            f
        },
        addSprite: function(a) {
            var b = new c.AudioSprite(this.game,a);
            return b
        },
        remove: function(a) {
            for (var b = this._sounds.length; b--; )
                if (this._sounds[b] === a)
                    return this._sounds[b].destroy(!1),
                    this._sounds.splice(b, 1),
                    !0;
            return !1
        },
        removeByKey: function(a) {
            for (var b = this._sounds.length, c = 0; b--; )
                this._sounds[b].key === a && (this._sounds[b].destroy(!1),
                this._sounds.splice(b, 1),
                c++);
            return c
        },
        play: function(a, b, c) {
            if (!this.noAudio) {
                var d = this.add(a, b, c);
                return d.play(),
                d
            }
        },
        setMute: function() {
            if (!this._muted) {
                this._muted = !0,
                this.usingWebAudio && (this._muteVolume = this.masterGain.gain.value,
                this.masterGain.gain.value = 0);
                for (var a = 0; a < this._sounds.length; a++)
                    this._sounds[a].usingAudioTag && (this._sounds[a].mute = !0);
                this.onMute.dispatch()
            }
        },
        unsetMute: function() {
            if (this._muted && !this._codeMuted) {
                this._muted = !1,
                this.usingWebAudio && (this.masterGain.gain.value = this._muteVolume);
                for (var a = 0; a < this._sounds.length; a++)
                    this._sounds[a].usingAudioTag && (this._sounds[a].mute = !1);
                this.onUnMute.dispatch()
            }
        },
        destroy: function() {
            this.stopAll();
            for (var a = 0; a < this._sounds.length; a++)
                this._sounds[a] && this._sounds[a].destroy();
            this._sounds = [],
            this.onSoundDecode.dispose(),
            this.context && window.PhaserGlobal && (window.PhaserGlobal.audioContext = this.context)
        }
    },
    c.SoundManager.prototype.constructor = c.SoundManager,
    Object.defineProperty(c.SoundManager.prototype, "mute", {
        get: function() {
            return this._muted
        },
        set: function(a) {
            if (a = a || !1) {
                if (this._muted)
                    return;
                this._codeMuted = !0,
                this.setMute()
            } else {
                if (!this._muted)
                    return;
                this._codeMuted = !1,
                this.unsetMute()
            }
        }
    }),
    Object.defineProperty(c.SoundManager.prototype, "volume", {
        get: function() {
            return this._volume
        },
        set: function(a) {
            if (0 > a ? a = 0 : a > 1 && (a = 1),
            this._volume !== a) {
                if (this._volume = a,
                this.usingWebAudio)
                    this.masterGain.gain.value = a;
                else
                    for (var b = 0; b < this._sounds.length; b++)
                        this._sounds[b].usingAudioTag && (this._sounds[b].volume = this._sounds[b].volume * a);
                this.onVolumeChange.dispatch(a)
            }
        }
    }),
    c.Utils.Debug = function(a) {
        this.game = a,
        this.sprite = null,
        this.bmd = null,
        this.canvas = null,
        this.context = null,
        this.font = "14px Courier",
        this.columnWidth = 100,
        this.lineHeight = 16,
        this.renderShadow = !0,
        this.currentX = 0,
        this.currentY = 0,
        this.currentAlpha = 1,
        this.dirty = !1
    }
    ,
    c.Utils.Debug.prototype = {
        boot: function() {
            this.game.renderType === c.CANVAS ? this.context = this.game.context : (this.bmd = this.game.make.bitmapData(this.game.width, this.game.height),
            this.sprite = this.game.make.image(0, 0, this.bmd),
            this.game.stage.addChild(this.sprite),
            this.canvas = PIXI.CanvasPool.create(this, this.game.width, this.game.height),
            this.context = this.canvas.getContext("2d"))
        },
        preUpdate: function() {
            this.dirty && this.sprite && (this.bmd.clear(),
            this.bmd.draw(this.canvas, 0, 0),
            this.context.clearRect(0, 0, this.game.width, this.game.height),
            this.dirty = !1)
        },
        reset: function() {
            this.context && this.context.clearRect(0, 0, this.game.width, this.game.height),
            this.sprite && this.bmd.clear()
        },
        start: function(a, b, c, d) {
            "number" != typeof a && (a = 0),
            "number" != typeof b && (b = 0),
            c = c || "rgb(255,255,255)",
            void 0 === d && (d = 0),
            this.currentX = a,
            this.currentY = b,
            this.currentColor = c,
            this.columnWidth = d,
            this.dirty = !0,
            this.context.save(),
            this.context.setTransform(1, 0, 0, 1, 0, 0),
            this.context.strokeStyle = c,
            this.context.fillStyle = c,
            this.context.font = this.font,
            this.context.globalAlpha = this.currentAlpha
        },
        stop: function() {
            this.context.restore()
        },
        line: function() {
            for (var a = this.currentX, b = 0; b < arguments.length; b++)
                this.renderShadow && (this.context.fillStyle = "rgb(0,0,0)",
                this.context.fillText(arguments[b], a + 1, this.currentY + 1),
                this.context.fillStyle = this.currentColor),
                this.context.fillText(arguments[b], a, this.currentY),
                a += this.columnWidth;
            this.currentY += this.lineHeight
        },
        soundInfo: function(a, b, c, d) {
            this.start(b, c, d),
            this.line("Sound: " + a.key + " Locked: " + a.game.sound.touchLocked),
            this.line("Is Ready?: " + this.game.cache.isSoundReady(a.key) + " Pending Playback: " + a.pendingPlayback),
            this.line("Decoded: " + a.isDecoded + " Decoding: " + a.isDecoding),
            this.line("Total Duration: " + a.totalDuration + " Playing: " + a.isPlaying),
            this.line("Time: " + a.currentTime),
            this.line("Volume: " + a.volume + " Muted: " + a.mute),
            this.line("WebAudio: " + a.usingWebAudio + " Audio: " + a.usingAudioTag),
            "" !== a.currentMarker && (this.line("Marker: " + a.currentMarker + " Duration: " + a.duration + " (ms: " + a.durationMS + ")"),
            this.line("Start: " + a.markers[a.currentMarker].start + " Stop: " + a.markers[a.currentMarker].stop),
            this.line("Position: " + a.position)),
            this.stop()
        },
        cameraInfo: function(a, b, c, d) {
            this.start(b, c, d),
            this.line("Camera (" + a.width + " x " + a.height + ")"),
            this.line("X: " + a.x + " Y: " + a.y),
            a.bounds && this.line("Bounds x: " + a.bounds.x + " Y: " + a.bounds.y + " w: " + a.bounds.width + " h: " + a.bounds.height),
            this.line("View x: " + a.view.x + " Y: " + a.view.y + " w: " + a.view.width + " h: " + a.view.height),
            this.line("Total in view: " + a.totalInView),
            this.stop()
        },
        timer: function(a, b, c, d) {
            this.start(b, c, d),
            this.line("Timer (running: " + a.running + " expired: " + a.expired + ")"),
            this.line("Next Tick: " + a.next + " Duration: " + a.duration),
            this.line("Paused: " + a.paused + " Length: " + a.length),
            this.stop()
        },
        pointer: function(a, b, c, d, e) {
            null != a && (void 0 === b && (b = !1),
            c = c || "rgba(0,255,0,0.5)",
            d = d || "rgba(255,0,0,0.5)",
            (b !== !0 || a.isUp !== !0) && (this.start(a.x, a.y - 100, e),
            this.context.beginPath(),
            this.context.arc(a.x, a.y, a.circle.radius, 0, 2 * Math.PI),
            this.context.fillStyle = a.active ? c : d,
            this.context.fill(),
            this.context.closePath(),
            this.context.beginPath(),
            this.context.moveTo(a.positionDown.x, a.positionDown.y),
            this.context.lineTo(a.position.x, a.position.y),
            this.context.lineWidth = 2,
            this.context.stroke(),
            this.context.closePath(),
            this.line("ID: " + a.id + " Active: " + a.active),
            this.line("World X: " + a.worldX + " World Y: " + a.worldY),
            this.line("Screen X: " + a.x + " Screen Y: " + a.y + " In: " + a.withinGame),
            this.line("Duration: " + a.duration + " ms"),
            this.line("is Down: " + a.isDown + " is Up: " + a.isUp),
            this.stop()))
        },
        spriteInputInfo: function(a, b, c, d) {
            this.start(b, c, d),
            this.line("Sprite Input: (" + a.width + " x " + a.height + ")"),
            this.line("x: " + a.input.pointerX().toFixed(1) + " y: " + a.input.pointerY().toFixed(1)),
            this.line("over: " + a.input.pointerOver() + " duration: " + a.input.overDuration().toFixed(0)),
            this.line("down: " + a.input.pointerDown() + " duration: " + a.input.downDuration().toFixed(0)),
            this.line("just over: " + a.input.justOver() + " just out: " + a.input.justOut()),
            this.stop()
        },
        key: function(a, b, c, d) {
            this.start(b, c, d, 150),
            this.line("Key:", a.keyCode, "isDown:", a.isDown),
            this.line("justDown:", a.justDown, "justUp:", a.justUp),
            this.line("Time Down:", a.timeDown.toFixed(0), "duration:", a.duration.toFixed(0)),
            this.stop()
        },
        inputInfo: function(a, b, c) {
            this.start(a, b, c),
            this.line("Input"),
            this.line("X: " + this.game.input.x + " Y: " + this.game.input.y),
            this.line("World X: " + this.game.input.worldX + " World Y: " + this.game.input.worldY),
            this.line("Scale X: " + this.game.input.scale.x.toFixed(1) + " Scale Y: " + this.game.input.scale.x.toFixed(1)),
            this.line("Screen X: " + this.game.input.activePointer.screenX + " Screen Y: " + this.game.input.activePointer.screenY),
            this.stop()
        },
        spriteBounds: function(a, b, c) {
            var d = a.getBounds();
            d.x += this.game.camera.x,
            d.y += this.game.camera.y,
            this.rectangle(d, b, c)
        },
        ropeSegments: function(a, b, c) {
            var d = a.segments
              , e = this;
            d.forEach(function(a) {
                e.rectangle(a, b, c)
            }, this)
        },
        spriteInfo: function(a, b, c, d) {
            this.start(b, c, d),
            this.line("Sprite:  (" + a.width + " x " + a.height + ") anchor: " + a.anchor.x + " x " + a.anchor.y),
            this.line("x: " + a.x.toFixed(1) + " y: " + a.y.toFixed(1)),
            this.line("angle: " + a.angle.toFixed(1) + " rotation: " + a.rotation.toFixed(1)),
            this.line("visible: " + a.visible + " in camera: " + a.inCamera),
            this.line("bounds x: " + a._bounds.x.toFixed(1) + " y: " + a._bounds.y.toFixed(1) + " w: " + a._bounds.width.toFixed(1) + " h: " + a._bounds.height.toFixed(1)),
            this.stop()
        },
        spriteCoords: function(a, b, c, d) {
            this.start(b, c, d, 100),
            a.name && this.line(a.name),
            this.line("x:", a.x.toFixed(2), "y:", a.y.toFixed(2)),
            this.line("pos x:", a.position.x.toFixed(2), "pos y:", a.position.y.toFixed(2)),
            this.line("world x:", a.world.x.toFixed(2), "world y:", a.world.y.toFixed(2)),
            this.stop()
        },
        lineInfo: function(a, b, c, d) {
            this.start(b, c, d, 80),
            this.line("start.x:", a.start.x.toFixed(2), "start.y:", a.start.y.toFixed(2)),
            this.line("end.x:", a.end.x.toFixed(2), "end.y:", a.end.y.toFixed(2)),
            this.line("length:", a.length.toFixed(2), "angle:", a.angle),
            this.stop()
        },
        pixel: function(a, b, c, d) {
            d = d || 2,
            this.start(),
            this.context.fillStyle = c,
            this.context.fillRect(a, b, d, d),
            this.stop()
        },
        geom: function(a, b, d, e) {
            void 0 === d && (d = !0),
            void 0 === e && (e = 0),
            b = b || "rgba(0,255,0,0.4)",
            this.start(),
            this.context.fillStyle = b,
            this.context.strokeStyle = b,
            a instanceof c.Rectangle || 1 === e ? d ? this.context.fillRect(a.x - this.game.camera.x, a.y - this.game.camera.y, a.width, a.height) : this.context.strokeRect(a.x - this.game.camera.x, a.y - this.game.camera.y, a.width, a.height) : a instanceof c.Circle || 2 === e ? (this.context.beginPath(),
            this.context.arc(a.x - this.game.camera.x, a.y - this.game.camera.y, a.radius, 0, 2 * Math.PI, !1),
            this.context.closePath(),
            d ? this.context.fill() : this.context.stroke()) : a instanceof c.Point || 3 === e ? this.context.fillRect(a.x - this.game.camera.x, a.y - this.game.camera.y, 4, 4) : (a instanceof c.Line || 4 === e) && (this.context.lineWidth = 1,
            this.context.beginPath(),
            this.context.moveTo(a.start.x + .5 - this.game.camera.x, a.start.y + .5 - this.game.camera.y),
            this.context.lineTo(a.end.x + .5 - this.game.camera.x, a.end.y + .5 - this.game.camera.y),
            this.context.closePath(),
            this.context.stroke()),
            this.stop()
        },
        rectangle: function(a, b, c) {
            void 0 === c && (c = !0),
            b = b || "rgba(0, 255, 0, 0.4)",
            this.start(),
            c ? (this.context.fillStyle = b,
            this.context.fillRect(a.x - this.game.camera.x, a.y - this.game.camera.y, a.width, a.height)) : (this.context.strokeStyle = b,
            this.context.strokeRect(a.x - this.game.camera.x, a.y - this.game.camera.y, a.width, a.height)),
            this.stop()
        },
        text: function(a, b, c, d, e) {
            d = d || "rgb(255,255,255)",
            e = e || "16px Courier",
            this.start(),
            this.context.font = e,
            this.renderShadow && (this.context.fillStyle = "rgb(0,0,0)",
            this.context.fillText(a, b + 1, c + 1)),
            this.context.fillStyle = d,
            this.context.fillText(a, b, c),
            this.stop()
        },
        quadTree: function(a, b) {
            b = b || "rgba(255,0,0,0.3)",
            this.start();
            var c = a.bounds;
            if (0 === a.nodes.length) {
                this.context.strokeStyle = b,
                this.context.strokeRect(c.x, c.y, c.width, c.height),
                this.text("size: " + a.objects.length, c.x + 4, c.y + 16, "rgb(0,200,0)", "12px Courier"),
                this.context.strokeStyle = "rgb(0,255,0)";
                for (var d = 0; d < a.objects.length; d++)
                    this.context.strokeRect(a.objects[d].x, a.objects[d].y, a.objects[d].width, a.objects[d].height)
            } else
                for (var d = 0; d < a.nodes.length; d++)
                    this.quadTree(a.nodes[d]);
            this.stop()
        },
        body: function(a, b, d) {
            a.body && (this.start(),
            a.body.type === c.Physics.ARCADE ? c.Physics.Arcade.Body.render(this.context, a.body, b, d) : a.body.type === c.Physics.NINJA ? c.Physics.Ninja.Body.render(this.context, a.body, b, d) : a.body.type === c.Physics.BOX2D && c.Physics.Box2D.renderBody(this.context, a.body, b),
            this.stop())
        },
        bodyInfo: function(a, b, d, e) {
            a.body && (this.start(b, d, e, 210),
            a.body.type === c.Physics.ARCADE ? c.Physics.Arcade.Body.renderBodyInfo(this, a.body) : a.body.type === c.Physics.BOX2D && this.game.physics.box2d.renderBodyInfo(this, a.body),
            this.stop())
        },
        box2dWorld: function() {
            this.start(),
            this.context.translate(-this.game.camera.view.x, -this.game.camera.view.y, 0),
            this.game.physics.box2d.renderDebugDraw(this.context),
            this.stop()
        },
        box2dBody: function(a, b) {
            this.start(),
            c.Physics.Box2D.renderBody(this.context, a, b),
            this.stop()
        },
        destroy: function() {
            PIXI.CanvasPool.remove(this)
        }
    },
    c.Utils.Debug.prototype.constructor = c.Utils.Debug,
    c.ArraySet = function(a) {
        this.position = 0,
        this.list = a || []
    }
    ,
    c.ArraySet.prototype = {
        add: function(a) {
            return this.exists(a) || this.list.push(a),
            a
        },
        getIndex: function(a) {
            return this.list.indexOf(a)
        },
        getByKey: function(a, b) {
            for (var c = this.list.length; c--; )
                if (this.list[c][a] === b)
                    return this.list[c];
            return null
        },
        exists: function(a) {
            return this.list.indexOf(a) > -1
        },
        reset: function() {
            this.list.length = 0
        },
        remove: function(a) {
            var b = this.list.indexOf(a);
            return b > -1 ? (this.list.splice(b, 1),
            a) : void 0
        },
        setAll: function(a, b) {
            for (var c = this.list.length; c--; )
                this.list[c] && (this.list[c][a] = b)
        },
        callAll: function(a) {
            for (var b = Array.prototype.splice.call(arguments, 1), c = this.list.length; c--; )
                this.list[c] && this.list[c][a] && this.list[c][a].apply(this.list[c], b)
        },
        removeAll: function(a) {
            void 0 === a && (a = !1);
            for (var b = this.list.length; b--; )
                if (this.list[b]) {
                    var c = this.remove(this.list[b]);
                    a && c.destroy()
                }
            this.position = 0,
            this.list = []
        }
    },
    Object.defineProperty(c.ArraySet.prototype, "total", {
        get: function() {
            return this.list.length
        }
    }),
    Object.defineProperty(c.ArraySet.prototype, "first", {
        get: function() {
            return this.position = 0,
            this.list.length > 0 ? this.list[0] : null
        }
    }),
    Object.defineProperty(c.ArraySet.prototype, "next", {
        get: function() {
            return this.position < this.list.length ? (this.position++,
            this.list[this.position]) : null
        }
    }),
    c.ArraySet.prototype.constructor = c.ArraySet,
    c.ArrayUtils = {
        getRandomItem: function(a, b, c) {
            if (null === a)
                return null;
            void 0 === b && (b = 0),
            void 0 === c && (c = a.length);
            var d = b + Math.floor(Math.random() * c);
            return void 0 === a[d] ? null : a[d]
        },
        removeRandomItem: function(a, b, c) {
            if (null == a)
                return null;
            void 0 === b && (b = 0),
            void 0 === c && (c = a.length);
            var d = b + Math.floor(Math.random() * c);
            if (d < a.length) {
                var e = a.splice(d, 1);
                return void 0 === e[0] ? null : e[0]
            }
            return null
        },
        shuffle: function(a) {
            for (var b = a.length - 1; b > 0; b--) {
                var c = Math.floor(Math.random() * (b + 1))
                  , d = a[b];
                a[b] = a[c],
                a[c] = d
            }
            return a
        },
        transposeMatrix: function(a) {
            for (var b = a.length, c = a[0].length, d = new Array(c), e = 0; c > e; e++) {
                d[e] = new Array(b);
                for (var f = b - 1; f > -1; f--)
                    d[e][f] = a[f][e]
            }
            return d
        },
        rotateMatrix: function(a, b) {
            if ("string" != typeof b && (b = (b % 360 + 360) % 360),
            90 === b || -270 === b || "rotateLeft" === b)
                a = c.ArrayUtils.transposeMatrix(a),
                a = a.reverse();
            else if (-90 === b || 270 === b || "rotateRight" === b)
                a = a.reverse(),
                a = c.ArrayUtils.transposeMatrix(a);
            else if (180 === Math.abs(b) || "rotate180" === b) {
                for (var d = 0; d < a.length; d++)
                    a[d].reverse();
                a = a.reverse()
            }
            return a
        },
        findClosest: function(a, b) {
            if (!b.length)
                return 0 / 0;
            if (1 === b.length || a < b[0])
                return b[0];
            for (var c = 1; b[c] < a; )
                c++;
            var d = b[c - 1]
              , e = c < b.length ? b[c] : Number.POSITIVE_INFINITY;
            return a - d >= e - a ? e : d
        },
        rotate: function(a) {
            var b = a.shift();
            return a.push(b),
            b
        },
        numberArray: function(a, b) {
            for (var c = [], d = a; b >= d; d++)
                c.push(d);
            return c
        },
        numberArrayStep: function(a, b, d) {
            (void 0 === a || null === a) && (a = 0),
            (void 0 === b || null === b) && (b = a,
            a = 0),
            void 0 === d && (d = 1);
            for (var e = [], f = Math.max(c.Math.roundAwayFromZero((b - a) / (d || 1)), 0), g = 0; f > g; g++)
                e.push(a),
                a += d;
            return e
        }
    },
    c.Color = {
        packPixel: function(a, b, d, e) {
            return c.Device.LITTLE_ENDIAN ? (e << 24 | d << 16 | b << 8 | a) >>> 0 : (a << 24 | b << 16 | d << 8 | e) >>> 0
        },
        unpackPixel: function(a, b, d, e) {
            return (void 0 === b || null === b) && (b = c.Color.createColor()),
            (void 0 === d || null === d) && (d = !1),
            (void 0 === e || null === e) && (e = !1),
            c.Device.LITTLE_ENDIAN ? (b.a = (4278190080 & a) >>> 24,
            b.b = (16711680 & a) >>> 16,
            b.g = (65280 & a) >>> 8,
            b.r = 255 & a) : (b.r = (4278190080 & a) >>> 24,
            b.g = (16711680 & a) >>> 16,
            b.b = (65280 & a) >>> 8,
            b.a = 255 & a),
            b.color = a,
            b.rgba = "rgba(" + b.r + "," + b.g + "," + b.b + "," + b.a / 255 + ")",
            d && c.Color.RGBtoHSL(b.r, b.g, b.b, b),
            e && c.Color.RGBtoHSV(b.r, b.g, b.b, b),
            b
        },
        fromRGBA: function(a, b) {
            return b || (b = c.Color.createColor()),
            b.r = (4278190080 & a) >>> 24,
            b.g = (16711680 & a) >>> 16,
            b.b = (65280 & a) >>> 8,
            b.a = 255 & a,
            b.rgba = "rgba(" + b.r + "," + b.g + "," + b.b + "," + b.a + ")",
            b
        },
        toRGBA: function(a, b, c, d) {
            return a << 24 | b << 16 | c << 8 | d
        },
        RGBtoHSL: function(a, b, d, e) {
            e || (e = c.Color.createColor(a, b, d, 1)),
            a /= 255,
            b /= 255,
            d /= 255;
            var f = Math.min(a, b, d)
              , g = Math.max(a, b, d);
            if (e.h = 0,
            e.s = 0,
            e.l = (g + f) / 2,
            g !== f) {
                var h = g - f;
                e.s = e.l > .5 ? h / (2 - g - f) : h / (g + f),
                g === a ? e.h = (b - d) / h + (d > b ? 6 : 0) : g === b ? e.h = (d - a) / h + 2 : g === d && (e.h = (a - b) / h + 4),
                e.h /= 6
            }
            return e
        },
        HSLtoRGB: function(a, b, d, e) {
            if (e ? (e.r = d,
            e.g = d,
            e.b = d) : e = c.Color.createColor(d, d, d),
            0 !== b) {
                var f = .5 > d ? d * (1 + b) : d + b - d * b
                  , g = 2 * d - f;
                e.r = c.Color.hueToColor(g, f, a + 1 / 3),
                e.g = c.Color.hueToColor(g, f, a),
                e.b = c.Color.hueToColor(g, f, a - 1 / 3)
            }
            return e.r = Math.floor(255 * e.r | 0),
            e.g = Math.floor(255 * e.g | 0),
            e.b = Math.floor(255 * e.b | 0),
            c.Color.updateColor(e),
            e
        },
        RGBtoHSV: function(a, b, d, e) {
            e || (e = c.Color.createColor(a, b, d, 255)),
            a /= 255,
            b /= 255,
            d /= 255;
            var f = Math.min(a, b, d)
              , g = Math.max(a, b, d)
              , h = g - f;
            return e.h = 0,
            e.s = 0 === g ? 0 : h / g,
            e.v = g,
            g !== f && (g === a ? e.h = (b - d) / h + (d > b ? 6 : 0) : g === b ? e.h = (d - a) / h + 2 : g === d && (e.h = (a - b) / h + 4),
            e.h /= 6),
            e
        },
        HSVtoRGB: function(a, b, d, e) {
            void 0 === e && (e = c.Color.createColor(0, 0, 0, 1, a, b, 0, d));
            var f, g, h, i = Math.floor(6 * a), j = 6 * a - i, k = d * (1 - b), l = d * (1 - j * b), m = d * (1 - (1 - j) * b);
            switch (i % 6) {
            case 0:
                f = d,
                g = m,
                h = k;
                break;
            case 1:
                f = l,
                g = d,
                h = k;
                break;
            case 2:
                f = k,
                g = d,
                h = m;
                break;
            case 3:
                f = k,
                g = l,
                h = d;
                break;
            case 4:
                f = m,
                g = k,
                h = d;
                break;
            case 5:
                f = d,
                g = k,
                h = l
            }
            return e.r = Math.floor(255 * f),
            e.g = Math.floor(255 * g),
            e.b = Math.floor(255 * h),
            c.Color.updateColor(e),
            e
        },
        hueToColor: function(a, b, c) {
            return 0 > c && (c += 1),
            c > 1 && (c -= 1),
            1 / 6 > c ? a + 6 * (b - a) * c : .5 > c ? b : 2 / 3 > c ? a + (b - a) * (2 / 3 - c) * 6 : a
        },
        createColor: function(a, b, d, e, f, g, h, i) {
            var j = {
                r: a || 0,
                g: b || 0,
                b: d || 0,
                a: e || 1,
                h: f || 0,
                s: g || 0,
                l: h || 0,
                v: i || 0,
                color: 0,
                color32: 0,
                rgba: ""
            };
            return c.Color.updateColor(j)
        },
        updateColor: function(a) {
            return a.rgba = "rgba(" + a.r.toString() + "," + a.g.toString() + "," + a.b.toString() + "," + a.a.toString() + ")",
            a.color = c.Color.getColor(a.r, a.g, a.b),
            a.color32 = c.Color.getColor32(a.a, a.r, a.g, a.b),
            a
        },
        getColor32: function(a, b, c, d) {
            return a << 24 | b << 16 | c << 8 | d
        },
        getColor: function(a, b, c) {
            return a << 16 | b << 8 | c
        },
        RGBtoString: function(a, b, d, e, f) {
            return void 0 === e && (e = 255),
            void 0 === f && (f = "#"),
            "#" === f ? "#" + ((1 << 24) + (a << 16) + (b << 8) + d).toString(16).slice(1) : "0x" + c.Color.componentToHex(e) + c.Color.componentToHex(a) + c.Color.componentToHex(b) + c.Color.componentToHex(d)
        },
        hexToRGB: function(a) {
            var b = c.Color.hexToColor(a);
            return b ? c.Color.getColor32(b.a, b.r, b.g, b.b) : void 0
        },
        hexToColor: function(a, b) {
            a = a.replace(/^(?:#|0x)?([a-f\d])([a-f\d])([a-f\d])$/i, function(a, b, c, d) {
                return b + b + c + c + d + d
            });
            var d = /^(?:#|0x)?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);
            if (d) {
                var e = parseInt(d[1], 16)
                  , f = parseInt(d[2], 16)
                  , g = parseInt(d[3], 16);
                b ? (b.r = e,
                b.g = f,
                b.b = g) : b = c.Color.createColor(e, f, g)
            }
            return b
        },
        webToColor: function(a, b) {
            b || (b = c.Color.createColor());
            var d = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?))?\s*\)$/.exec(a);
            return d && (b.r = parseInt(d[1], 10),
            b.g = parseInt(d[2], 10),
            b.b = parseInt(d[3], 10),
            b.a = void 0 !== d[4] ? parseFloat(d[4]) : 1,
            c.Color.updateColor(b)),
            b
        },
        valueToColor: function(a, b) {
            if (b || (b = c.Color.createColor()),
            "string" == typeof a)
                return 0 === a.indexOf("rgb") ? c.Color.webToColor(a, b) : (b.a = 1,
                c.Color.hexToColor(a, b));
            if ("number" == typeof a) {
                var d = c.Color.getRGB(a);
                return b.r = d.r,
                b.g = d.g,
                b.b = d.b,
                b.a = d.a / 255,
                b
            }
            return b
        },
        componentToHex: function(a) {
            var b = a.toString(16);
            return 1 == b.length ? "0" + b : b
        },
        HSVColorWheel: function(a, b) {
            void 0 === a && (a = 1),
            void 0 === b && (b = 1);
            for (var d = [], e = 0; 359 >= e; e++)
                d.push(c.Color.HSVtoRGB(e / 359, a, b));
            return d
        },
        HSLColorWheel: function(a, b) {
            void 0 === a && (a = .5),
            void 0 === b && (b = .5);
            for (var d = [], e = 0; 359 >= e; e++)
                d.push(c.Color.HSLtoRGB(e / 359, a, b));
            return d
        },
        interpolateColor: function(a, b, d, e, f) {
            void 0 === f && (f = 255);
            var g = c.Color.getRGB(a)
              , h = c.Color.getRGB(b)
              , i = (h.red - g.red) * e / d + g.red
              , j = (h.green - g.green) * e / d + g.green
              , k = (h.blue - g.blue) * e / d + g.blue;
            return c.Color.getColor32(f, i, j, k)
        },
        interpolateColorWithRGB: function(a, b, d, e, f, g) {
            var h = c.Color.getRGB(a)
              , i = (b - h.red) * g / f + h.red
              , j = (d - h.green) * g / f + h.green
              , k = (e - h.blue) * g / f + h.blue;
            return c.Color.getColor(i, j, k)
        },
        interpolateRGB: function(a, b, d, e, f, g, h, i) {
            var j = (e - a) * i / h + a
              , k = (f - b) * i / h + b
              , l = (g - d) * i / h + d;
            return c.Color.getColor(j, k, l)
        },
        getRandomColor: function(a, b, d) {
            if (void 0 === a && (a = 0),
            void 0 === b && (b = 255),
            void 0 === d && (d = 255),
            b > 255 || a > b)
                return c.Color.getColor(255, 255, 255);
            var e = a + Math.round(Math.random() * (b - a))
              , f = a + Math.round(Math.random() * (b - a))
              , g = a + Math.round(Math.random() * (b - a));
            return c.Color.getColor32(d, e, f, g)
        },
        getRGB: function(a) {
            return a > 16777215 ? {
                alpha: a >>> 24,
                red: a >> 16 & 255,
                green: a >> 8 & 255,
                blue: 255 & a,
                a: a >>> 24,
                r: a >> 16 & 255,
                g: a >> 8 & 255,
                b: 255 & a
            } : {
                alpha: 255,
                red: a >> 16 & 255,
                green: a >> 8 & 255,
                blue: 255 & a,
                a: 255,
                r: a >> 16 & 255,
                g: a >> 8 & 255,
                b: 255 & a
            }
        },
        getWebRGB: function(a) {
            if ("object" == typeof a)
                return "rgba(" + a.r.toString() + "," + a.g.toString() + "," + a.b.toString() + "," + (a.a / 255).toString() + ")";
            var b = c.Color.getRGB(a);
            return "rgba(" + b.r.toString() + "," + b.g.toString() + "," + b.b.toString() + "," + (b.a / 255).toString() + ")"
        },
        getAlpha: function(a) {
            return a >>> 24
        },
        getAlphaFloat: function(a) {
            return (a >>> 24) / 255
        },
        getRed: function(a) {
            return a >> 16 & 255
        },
        getGreen: function(a) {
            return a >> 8 & 255
        },
        getBlue: function(a) {
            return 255 & a
        },
        blendNormal: function(a) {
            return a
        },
        blendLighten: function(a, b) {
            return b > a ? b : a
        },
        blendDarken: function(a, b) {
            return b > a ? a : b
        },
        blendMultiply: function(a, b) {
            return a * b / 255
        },
        blendAverage: function(a, b) {
            return (a + b) / 2
        },
        blendAdd: function(a, b) {
            return Math.min(255, a + b)
        },
        blendSubtract: function(a, b) {
            return Math.max(0, a + b - 255)
        },
        blendDifference: function(a, b) {
            return Math.abs(a - b)
        },
        blendNegation: function(a, b) {
            return 255 - Math.abs(255 - a - b)
        },
        blendScreen: function(a, b) {
            return 255 - ((255 - a) * (255 - b) >> 8)
        },
        blendExclusion: function(a, b) {
            return a + b - 2 * a * b / 255
        },
        blendOverlay: function(a, b) {
            return 128 > b ? 2 * a * b / 255 : 255 - 2 * (255 - a) * (255 - b) / 255
        },
        blendSoftLight: function(a, b) {
            return 128 > b ? 2 * ((a >> 1) + 64) * (b / 255) : 255 - 2 * (255 - ((a >> 1) + 64)) * (255 - b) / 255
        },
        blendHardLight: function(a, b) {
            return c.Color.blendOverlay(b, a)
        },
        blendColorDodge: function(a, b) {
            return 255 === b ? b : Math.min(255, (a << 8) / (255 - b))
        },
        blendColorBurn: function(a, b) {
            return 0 === b ? b : Math.max(0, 255 - (255 - a << 8) / b)
        },
        blendLinearDodge: function(a, b) {
            return c.Color.blendAdd(a, b)
        },
        blendLinearBurn: function(a, b) {
            return c.Color.blendSubtract(a, b)
        },
        blendLinearLight: function(a, b) {
            return 128 > b ? c.Color.blendLinearBurn(a, 2 * b) : c.Color.blendLinearDodge(a, 2 * (b - 128))
        },
        blendVividLight: function(a, b) {
            return 128 > b ? c.Color.blendColorBurn(a, 2 * b) : c.Color.blendColorDodge(a, 2 * (b - 128))
        },
        blendPinLight: function(a, b) {
            return 128 > b ? c.Color.blendDarken(a, 2 * b) : c.Color.blendLighten(a, 2 * (b - 128))
        },
        blendHardMix: function(a, b) {
            return c.Color.blendVividLight(a, b) < 128 ? 0 : 255
        },
        blendReflect: function(a, b) {
            return 255 === b ? b : Math.min(255, a * a / (255 - b))
        },
        blendGlow: function(a, b) {
            return c.Color.blendReflect(b, a)
        },
        blendPhoenix: function(a, b) {
            return Math.min(a, b) - Math.max(a, b) + 255
        }
    },
    c.LinkedList = function() {
        this.next = null,
        this.prev = null,
        this.first = null,
        this.last = null,
        this.total = 0
    }
    ,
    c.LinkedList.prototype = {
        add: function(a) {
            return 0 === this.total && null === this.first && null === this.last ? (this.first = a,
            this.last = a,
            this.next = a,
            a.prev = this,
            this.total++,
            a) : (this.last.next = a,
            a.prev = this.last,
            this.last = a,
            this.total++,
            a)
        },
        reset: function() {
            this.first = null,
            this.last = null,
            this.next = null,
            this.prev = null,
            this.total = 0
        },
        remove: function(a) {
            return 1 === this.total ? (this.reset(),
            void (a.next = a.prev = null)) : (a === this.first ? this.first = this.first.next : a === this.last && (this.last = this.last.prev),
            a.prev && (a.prev.next = a.next),
            a.next && (a.next.prev = a.prev),
            a.next = a.prev = null,
            null === this.first && (this.last = null),
            void this.total--)
        },
        callAll: function(a) {
            if (this.first && this.last) {
                var b = this.first;
                do
                    b && b[a] && b[a].call(b),
                    b = b.next;
                while (b != this.last.next)
            }
        }
    },
    c.LinkedList.prototype.constructor = c.LinkedList,
    c.Physics = function(a, b) {
        b = b || {},
        this.game = a,
        this.config = b,
        this.arcade = null,
        this.p2 = null,
        this.ninja = null,
        this.box2d = null,
        this.chipmunk = null,
        this.matter = null,
        this.parseConfig()
    }
    ,
    c.Physics.ARCADE = 0,
    c.Physics.P2JS = 1,
    c.Physics.NINJA = 2,
    c.Physics.BOX2D = 3,
    c.Physics.CHIPMUNK = 4,
    c.Physics.MATTERJS = 5,
    c.Physics.prototype = {
        parseConfig: function() {
            this.config.hasOwnProperty("arcade") && this.config.arcade !== !0 || !c.Physics.hasOwnProperty("Arcade") || (this.arcade = new c.Physics.Arcade(this.game)),
            this.config.hasOwnProperty("ninja") && this.config.ninja === !0 && c.Physics.hasOwnProperty("Ninja") && (this.ninja = new c.Physics.Ninja(this.game)),
            this.config.hasOwnProperty("p2") && this.config.p2 === !0 && c.Physics.hasOwnProperty("P2") && (this.p2 = new c.Physics.P2(this.game,this.config)),
            this.config.hasOwnProperty("box2d") && this.config.box2d === !0 && c.Physics.hasOwnProperty("BOX2D") && (this.box2d = new c.Physics.BOX2D(this.game,this.config)),
            this.config.hasOwnProperty("matter") && this.config.matter === !0 && c.Physics.hasOwnProperty("Matter") && (this.matter = new c.Physics.Matter(this.game,this.config))
        },
        startSystem: function(a) {
            a === c.Physics.ARCADE ? this.arcade = new c.Physics.Arcade(this.game) : a === c.Physics.P2JS ? null === this.p2 ? this.p2 = new c.Physics.P2(this.game,this.config) : this.p2.reset() : a === c.Physics.NINJA ? this.ninja = new c.Physics.Ninja(this.game) : a === c.Physics.BOX2D ? null === this.box2d ? this.box2d = new c.Physics.Box2D(this.game,this.config) : this.box2d.reset() : a === c.Physics.MATTERJS && (null === this.matter ? this.matter = new c.Physics.Matter(this.game,this.config) : this.matter.reset())
        },
        enable: function(a, b, d) {
            void 0 === b && (b = c.Physics.ARCADE),
            void 0 === d && (d = !1),
            b === c.Physics.ARCADE ? this.arcade.enable(a) : b === c.Physics.P2JS && this.p2 ? this.p2.enable(a, d) : b === c.Physics.NINJA && this.ninja ? this.ninja.enableAABB(a) : b === c.Physics.BOX2D && this.box2d ? this.box2d.enable(a) : b === c.Physics.MATTERJS && this.matter && this.matter.enable(a)
        },
        preUpdate: function() {
            this.p2 && this.p2.preUpdate(),
            this.box2d && this.box2d.preUpdate(),
            this.matter && this.matter.preUpdate()
        },
        update: function() {
            this.p2 && this.p2.update(),
            this.box2d && this.box2d.update(),
            this.matter && this.matter.update()
        },
        setBoundsToWorld: function() {
            this.arcade && this.arcade.setBoundsToWorld(),
            this.ninja && this.ninja.setBoundsToWorld(),
            this.p2 && this.p2.setBoundsToWorld(),
            this.box2d && this.box2d.setBoundsToWorld(),
            this.matter && this.matter.setBoundsToWorld()
        },
        clear: function() {
            this.p2 && this.p2.clear(),
            this.box2d && this.box2d.clear(),
            this.matter && this.matter.clear()
        },
        reset: function() {
            this.p2 && this.p2.reset(),
            this.box2d && this.box2d.reset(),
            this.matter && this.matter.reset()
        },
        destroy: function() {
            this.p2 && this.p2.destroy(),
            this.box2d && this.box2d.destroy(),
            this.matter && this.matter.destroy(),
            this.arcade = null,
            this.ninja = null,
            this.p2 = null,
            this.box2d = null,
            this.matter = null
        }
    },
    c.Physics.prototype.constructor = c.Physics,
    c.Particles = function(a) {
        this.game = a,
        this.emitters = {},
        this.ID = 0
    }
    ,
    c.Particles.prototype = {
        add: function(a) {
            return this.emitters[a.name] = a,
            a
        },
        remove: function(a) {
            delete this.emitters[a.name]
        },
        update: function() {
            for (var a in this.emitters)
                this.emitters[a].exists && this.emitters[a].update()
        }
    },
    c.Particles.prototype.constructor = c.Particles,
    c.Video = function(a, b, d) {
        if (void 0 === b && (b = null),
        void 0 === d && (d = null),
        this.game = a,
        this.key = b,
        this.width = 0,
        this.height = 0,
        this.type = c.VIDEO,
        this.disableTextureUpload = !1,
        this.touchLocked = !1,
        this.onPlay = new c.Signal,
        this.onChangeSource = new c.Signal,
        this.onComplete = new c.Signal,
        this.onAccess = new c.Signal,
        this.onError = new c.Signal,
        this.onTimeout = new c.Signal,
        this.timeout = 15e3,
        this._timeOutID = null,
        this.video = null,
        this.videoStream = null,
        this.isStreaming = !1,
        this.retryLimit = 20,
        this.retry = 0,
        this.retryInterval = 500,
        this._retryID = null,
        this._codeMuted = !1,
        this._muted = !1,
        this._codePaused = !1,
        this._paused = !1,
        this._pending = !1,
        this._autoplay = !1,
        b && this.game.cache.checkVideoKey(b)) {
            var e = this.game.cache.getVideo(b);
            e.isBlob ? this.createVideoFromBlob(e.data) : this.video = e.data,
            this.width = this.video.videoWidth,
            this.height = this.video.videoHeight
        } else
            d && this.createVideoFromURL(d, !1);
        this.video && !d ? (this.baseTexture = new PIXI.BaseTexture(this.video),
        this.baseTexture.forceLoaded(this.width, this.height)) : (this.baseTexture = new PIXI.BaseTexture(PIXI.TextureCache.__default.baseTexture.source),
        this.baseTexture.forceLoaded(this.width, this.height)),
        this.texture = new PIXI.Texture(this.baseTexture),
        this.textureFrame = new c.Frame(0,0,0,this.width,this.height,"video"),
        this.texture.setFrame(this.textureFrame),
        this.texture.valid = !1,
        null !== b && this.video && (this.texture.valid = this.video.canplay),
        this.snapshot = null,
        c.BitmapData && (this.snapshot = new c.BitmapData(this.game,"",this.width,this.height)),
        !this.game.device.cocoonJS && (this.game.device.iOS || this.game.device.android) || window.PhaserGlobal && window.PhaserGlobal.fakeiOSTouchLock ? this.setTouchLock() : e && (e.locked = !1)
    }
    ,
    c.Video.prototype = {
        connectToMediaStream: function(a, b) {
            return a && b && (this.video = a,
            this.videoStream = b,
            this.isStreaming = !0,
            this.baseTexture.source = this.video,
            this.updateTexture(null, this.video.videoWidth, this.video.videoHeight),
            this.onAccess.dispatch(this)),
            this
        },
        startMediaStream: function(a, b, c) {
            if (void 0 === a && (a = !1),
            void 0 === b && (b = null),
            void 0 === c && (c = null),
            !this.game.device.getUserMedia)
                return this.onError.dispatch(this, "No getUserMedia"),
                !1;
            null !== this.videoStream && (this.videoStream.active ? this.videoStream.active = !1 : this.videoStream.stop()),
            this.removeVideoElement(),
            this.video = document.createElement("video"),
            this.video.setAttribute("autoplay", "autoplay"),
            null !== b && (this.video.width = b),
            null !== c && (this.video.height = c),
            this._timeOutID = window.setTimeout(this.getUserMediaTimeout.bind(this), this.timeout);
            try {
                navigator.getUserMedia({
                    audio: a,
                    video: !0
                }, this.getUserMediaSuccess.bind(this), this.getUserMediaError.bind(this))
            } catch (d) {
                this.getUserMediaError(d)
            }
            return this
        },
        getUserMediaTimeout: function() {
            clearTimeout(this._timeOutID),
            this.onTimeout.dispatch(this)
        },
        getUserMediaError: function(a) {
            clearTimeout(this._timeOutID),
            this.onError.dispatch(this, a)
        },
        getUserMediaSuccess: function(a) {
            clearTimeout(this._timeOutID),
            this.videoStream = a,
            void 0 !== this.video.mozSrcObject ? this.video.mozSrcObject = a : this.video.src = window.URL && window.URL.createObjectURL(a) || a;
            var b = this;
            this.video.onloadeddata = function() {
                function a() {
                    if (c > 0)
                        if (b.video.videoWidth > 0) {
                            var d = b.video.videoWidth
                              , e = b.video.videoHeight;
                            isNaN(b.video.videoHeight) && (e = d / (4 / 3)),
                            b.video.play(),
                            b.isStreaming = !0,
                            b.baseTexture.source = b.video,
                            b.updateTexture(null, d, e),
                            b.onAccess.dispatch(b)
                        } else
                            window.setTimeout(a, 500);
                    else
                        console.warn("Unable to connect to video stream. Webcam error?");
                    c--
                }
                var c = 10;
                a()
            }
        },
        createVideoFromBlob: function(a) {
            var b = this;
            return this.video = document.createElement("video"),
            this.video.controls = !1,
            this.video.setAttribute("autoplay", "autoplay"),
            this.video.addEventListener("loadeddata", function(a) {
                b.updateTexture(a)
            }, !0),
            this.video.src = window.URL.createObjectURL(a),
            this.video.canplay = !0,
            this
        },
        createVideoFromURL: function(a, b) {
            return void 0 === b && (b = !1),
            this.texture && (this.texture.valid = !1),
            this.video = document.createElement("video"),
            this.video.controls = !1,
            b && this.video.setAttribute("autoplay", "autoplay"),
            this.video.src = a,
            this.video.canplay = !0,
            this.video.load(),
            this.retry = this.retryLimit,
            this._retryID = window.setTimeout(this.checkVideoProgress.bind(this), this.retryInterval),
            this.key = a,
            this
        },
        updateTexture: function(a, b, c) {
            var d = !1;
            (void 0 === b || null === b) && (b = this.video.videoWidth,
            d = !0),
            (void 0 === c || null === c) && (c = this.video.videoHeight),
            this.width = b,
            this.height = c,
            this.baseTexture.source !== this.video && (this.baseTexture.source = this.video),
            this.baseTexture.forceLoaded(b, c),
            this.texture.frame.resize(b, c),
            this.texture.width = b,
            this.texture.height = c,
            this.texture.valid = !0,
            this.snapshot && this.snapshot.resize(b, c),
            d && null !== this.key && (this.onChangeSource.dispatch(this, b, c),
            this._autoplay && (this.video.play(),
            this.onPlay.dispatch(this, this.loop, this.playbackRate)))
        },
        complete: function() {
            this.onComplete.dispatch(this)
        },
        play: function(a, b) {
            return void 0 === a && (a = !1),
            void 0 === b && (b = 1),
            this.game.sound.onMute && (this.game.sound.onMute.add(this.setMute, this),
            this.game.sound.onUnMute.add(this.unsetMute, this),
            this.game.sound.mute && this.setMute()),
            this.game.onPause.add(this.setPause, this),
            this.game.onResume.add(this.setResume, this),
            this.video.addEventListener("ended", this.complete.bind(this), !0),
            this.video.loop = a ? "loop" : "",
            this.video.playbackRate = b,
            this.touchLocked ? this._pending = !0 : (this._pending = !1,
            null !== this.key && (4 !== this.video.readyState ? (this.retry = this.retryLimit,
            this._retryID = window.setTimeout(this.checkVideoProgress.bind(this), this.retryInterval)) : this.video.addEventListener("playing", this.playHandler.bind(this), !0)),
            this.video.play(),
            this.onPlay.dispatch(this, a, b)),
            this
        },
        playHandler: function() {
            this.video.removeEventListener("playing", this.playHandler.bind(this)),
            this.updateTexture()
        },
        stop: function() {
            return this.game.sound.onMute && (this.game.sound.onMute.remove(this.setMute, this),
            this.game.sound.onUnMute.remove(this.unsetMute, this)),
            this.game.onPause.remove(this.setPause, this),
            this.game.onResume.remove(this.setResume, this),
            this.isStreaming ? (this.video.mozSrcObject ? (this.video.mozSrcObject.stop(),
            this.video.src = null) : (this.video.src = "",
            this.videoStream.active ? this.videoStream.active = !1 : this.videoStream.stop()),
            this.videoStream = null,
            this.isStreaming = !1) : (this.video.removeEventListener("ended", this.complete.bind(this), !0),
            this.video.removeEventListener("playing", this.playHandler.bind(this), !0),
            this.touchLocked ? this._pending = !1 : this.video.pause()),
            this
        },
        add: function(a) {
            if (Array.isArray(a))
                for (var b = 0; b < a.length; b++)
                    a[b].loadTexture && a[b].loadTexture(this);
            else
                a.loadTexture(this);
            return this
        },
        addToWorld: function(a, b, c, d, e, f) {
            e = e || 1,
            f = f || 1;
            var g = this.game.add.image(a, b, this);
            return g.anchor.set(c, d),
            g.scale.set(e, f),
            g
        },
        render: function() {
            !this.disableTextureUpload && this.playing && this.baseTexture.dirty()
        },
        setMute: function() {
            this._muted || (this._muted = !0,
            this.video.muted = !0)
        },
        unsetMute: function() {
            this._muted && !this._codeMuted && (this._muted = !1,
            this.video.muted = !1)
        },
        setPause: function() {
            this._paused || this.touchLocked || (this._paused = !0,
            this.video.pause())
        },
        setResume: function() {
            !this._paused || this._codePaused || this.touchLocked || (this._paused = !1,
            this.video.ended || this.video.play())
        },
        changeSource: function(a, b) {
            return void 0 === b && (b = !0),
            this.texture.valid = !1,
            this.video.pause(),
            this.retry = this.retryLimit,
            this._retryID = window.setTimeout(this.checkVideoProgress.bind(this), this.retryInterval),
            this.video.src = a,
            this.video.load(),
            this._autoplay = b,
            b || (this.paused = !0),
            this
        },
        checkVideoProgress: function() {
            4 === this.video.readyState ? this.updateTexture() : (this.retry--,
            this.retry > 0 ? this._retryID = window.setTimeout(this.checkVideoProgress.bind(this), this.retryInterval) : console.warn("Phaser.Video: Unable to start downloading video in time", this.isStreaming))
        },
        setTouchLock: function() {
            this.game.input.touch.addTouchLockCallback(this.unlock, this),
            this.touchLocked = !0
        },
        unlock: function() {
            if (this.touchLocked = !1,
            this.video.play(),
            this.onPlay.dispatch(this, this.loop, this.playbackRate),
            this.key) {
                var a = this.game.cache.getVideo(this.key);
                a && !a.isBlob && (a.locked = !1)
            }
            return !0
        },
        grab: function(a, b, c) {
            return void 0 === a && (a = !1),
            void 0 === b && (b = 1),
            void 0 === c && (c = null),
            null === this.snapshot ? void console.warn("Video.grab cannot run because Phaser.BitmapData is unavailable") : (a && this.snapshot.cls(),
            this.snapshot.copy(this.video, 0, 0, this.width, this.height, 0, 0, this.width, this.height, 0, 0, 0, 1, 1, b, c),
            this.snapshot)
        },
        removeVideoElement: function() {
            if (this.video) {
                for (this.video.parentNode && this.video.parentNode.removeChild(this.video); this.video.hasChildNodes(); )
                    this.video.removeChild(this.video.firstChild);
                this.video.removeAttribute("autoplay"),
                this.video.removeAttribute("src"),
                this.video = null
            }
        },
        destroy: function() {
            this.stop(),
            this.removeVideoElement(),
            this.touchLocked && this.game.input.touch.removeTouchLockCallback(this.unlock, this),
            this._retryID && window.clearTimeout(this._retryID)
        }
    },
    Object.defineProperty(c.Video.prototype, "currentTime", {
        get: function() {
            return this.video ? this.video.currentTime : 0
        },
        set: function(a) {
            this.video.currentTime = a
        }
    }),
    Object.defineProperty(c.Video.prototype, "duration", {
        get: function() {
            return this.video ? this.video.duration : 0
        }
    }),
    Object.defineProperty(c.Video.prototype, "progress", {
        get: function() {
            return this.video ? this.video.currentTime / this.video.duration : 0
        }
    }),
    Object.defineProperty(c.Video.prototype, "mute", {
        get: function() {
            return this._muted
        },
        set: function(a) {
            if (a = a || null) {
                if (this._muted)
                    return;
                this._codeMuted = !0,
                this.setMute()
            } else {
                if (!this._muted)
                    return;
                this._codeMuted = !1,
                this.unsetMute()
            }
        }
    }),
    Object.defineProperty(c.Video.prototype, "paused", {
        get: function() {
            return this._paused
        },
        set: function(a) {
            if (a = a || null,
            !this.touchLocked)
                if (a) {
                    if (this._paused)
                        return;
                    this._codePaused = !0,
                    this.setPause()
                } else {
                    if (!this._paused)
                        return;
                    this._codePaused = !1,
                    this.setResume()
                }
        }
    }),
    Object.defineProperty(c.Video.prototype, "volume", {
        get: function() {
            return this.video ? this.video.volume : 1
        },
        set: function(a) {
            0 > a ? a = 0 : a > 1 && (a = 1),
            this.video && (this.video.volume = a)
        }
    }),
    Object.defineProperty(c.Video.prototype, "playbackRate", {
        get: function() {
            return this.video ? this.video.playbackRate : 1
        },
        set: function(a) {
            this.video && (this.video.playbackRate = a)
        }
    }),
    Object.defineProperty(c.Video.prototype, "loop", {
        get: function() {
            return this.video ? this.video.loop : !1
        },
        set: function(a) {
            a && this.video ? this.video.loop = "loop" : this.video && (this.video.loop = "")
        }
    }),
    Object.defineProperty(c.Video.prototype, "playing", {
        get: function() {
            return !(this.video.paused && this.video.ended)
        }
    }),
    c.Video.prototype.constructor = c.Video,
    void 0 === PIXI.blendModes && (PIXI.blendModes = c.blendModes),
    void 0 === PIXI.scaleModes && (PIXI.scaleModes = c.scaleModes),
    void 0 === PIXI.Texture.emptyTexture && (PIXI.Texture.emptyTexture = new PIXI.Texture(new PIXI.BaseTexture)),
    void 0 === PIXI.DisplayObject._tempMatrix && (PIXI.DisplayObject._tempMatrix = new PIXI.Matrix),
    void 0 === PIXI.RenderTexture.tempMatrix && (PIXI.RenderTexture.tempMatrix = new PIXI.Matrix),
    void 0 === PIXI.Graphics.POLY && (PIXI.Graphics.POLY = c.POLYGON,
    PIXI.Graphics.RECT = c.RECTANGLE,
    PIXI.Graphics.CIRC = c.CIRCLE,
    PIXI.Graphics.ELIP = c.ELLIPSE,
    PIXI.Graphics.RREC = c.ROUNDEDRECTANGLE),
    PIXI.TextureSilentFail = !0,
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = c),
    exports.Phaser = c) : "undefined" != typeof define && define.amd ? define("Phaser", function() {
        return b.Phaser = c
    }()) : b.Phaser = c,
    c
}
.call(this);
//# sourceMappingURL=phaser-no-physics.map
var r164 = 0
  , r145 = 1
  , r165 = 2;
SoundManager = function(a) {
    this.game = a;
    this.soundPlaying = !0;
    this.sounds = []
}
;
SoundManager.prototype = {
    constructor: SoundManager,
    create: function() {
        this.sounds[r164] = game.add.audio("sndWin", 1, !1);
        this.sounds[r145] = game.add.audio("sndLose", 1, !1);
        this.sounds[r165] = game.add.audio("sndHit", 1, !1)
    },
    r166: function(a) {
        this.soundPlaying && this.sounds[a].play()
    },
    r114: function(a) {
        this.soundPlaying = !this.soundPlaying;
        saveAllGameData()
    }
};
var r115 = [];
Particles = function() {}
;
Particles.prototype = {
    constructor: Particles,
    r88: function(a, b, c, d, e, f, g) {
        for (var h = null, k = 0; k < r115.length && null == h; k++)
            r115[k].sprite.visible || (h = r115[k]);
        null === h && (h = r115[r115.length] = {});
        h.sprite = g;
        h.sprite.x = a;
        h.sprite.y = b;
        h.velX = c;
        h.velY = d;
        h.accX = e;
        h.accY = f;
        h.life = 20 + game.rnd.integerInRange(0, 5);
        return h
    },
    Reset: function() {
        for (var a = 0; a < r115.length; a++)
            r115[a].sprite.visible = !1
    },
    Update: function() {
        for (var a = 0; a < r115.length; a++)
            r115[a].sprite.visible && (0 >= r115[a].life ? r115[a].sprite.visible = !1 : (r115[a].life--,
            r115[a].sprite.x += r115[a].velX,
            r115[a].sprite.y += r115[a].velY,
            r115[a].velX += r115[a].accX,
            r115[a].velY += r115[a].accY))
    },
    r47: function(a, b, c) {
        r172Count = 6;
        for (var d = r172Count - 1; 0 <= d; d--) {
            tmpX = game.rnd.integerInRange(-100, 100) / 50;
            tmpY = game.rnd.integerInRange(-100, 100) / 50;
            var e = new Phaser.Sprite(game,-100,-100,"star",game.rnd.integerInRange(0, 3));
            e.anchor.set(.5);
            a.add(e);
            this.r88(b + game.rnd.integerInRange(-4, 4), c + game.rnd.integerInRange(-4, 4), tmpX, tmpY, 0 >= tmpX ? .01 : -.01, 0 >= tmpY ? .01 : -.01, e)
        }
    },
    r116: function(a, b, c) {
        r172Count = 6;
        for (var d = r172Count - 1; 0 <= d; d--) {
            tmpX = game.rnd.integerInRange(-100, 100) / 70;
            tmpY = -game.rnd.integerInRange(0, 100) / 35;
            var e = new Phaser.Sprite(game,-100,-100,"dropSplash",game.rnd.integerInRange(0, 3));
            e.anchor.set(.5);
            a.add(e);
            this.r88(b + game.rnd.integerInRange(-4, 4), c + game.rnd.integerInRange(-4, 4), tmpX, tmpY, 0 >= tmpX ? .01 : -.01, .4, e)
        }
    }
};
var r167 = function() {
    if (null != r167.instance)
        return r167.instance;
    r167.instance = this;
    this.xml = this.gameTextsParsed = null;
    this.gameTextsLists = [];
    var a = game.cache.getText("lang_strings");
    this.gameTextsParsed = (new DOMParser).parseFromString(a, "text/xml");
    for (var a = this.gameTextsParsed.getElementsByTagName("string"), b = 0; b < a.length; b++) {
        null == this.gameTextsLists[a.item(b).getAttribute("id")] && (this.gameTextsLists[a.item(b).getAttribute("id")] = []);
        for (var c = 0; c < r168.length; c++)
            0 < a.item(b).getElementsByTagName(r168[c]).length && (this.gameTextsLists[a.item(b).getAttribute("id")][r168[c]] = a.item(b).getElementsByTagName(r168[c])[0].textContent.replace(/\\n/g, "\n").toUpperCase())
    }
}
  , r131 = 0
  , r132 = 1
  , r133 = 2
  , r134 = 3
  , r135 = 4
  , r136 = 5
  , r137 = 6
  , r168 = "en de fr es pt it br".split(" ");
r167.instance = null;
r167.prototype = {};
function STR(a) {
    return void 0 == r167.instance.gameTextsLists[a] || void 0 == r167.instance.gameTextsLists[a][r167.instance.language] ? "NAN" : r167.instance.gameTextsLists[a][r167.instance.language].replaceAll("\\n", "\n")
}
;var ANALYTICS_ENABLED = !1
  , ANALYTICS_ENABLED = !0;
(function(a, b, c, d, e, f, g) {
    a.GoogleAnalyticsObject = e;
    a[e] = a[e] || function() {
        (a[e].q = a[e].q || []).push(arguments)
    }
    ;
    a[e].l = 1 * new Date;
    f = b.createElement(c);
    g = b.getElementsByTagName(c)[0];
    f.async = 1;
    f.src = d;
    g.parentNode.insertBefore(f, g)
}
)(window, document, "script", "//www.google-analytics.com/analytics.js", "_gaTrack");
_gaTrack("create", "UA-57743254-25", "auto");
_gaTrack("send", "pageview");
var partnerName = "idnet";
function r3() {
    ANALYTICS_ENABLED && _gaTrack("send", "event", "basic", "loaded", partnerName, 1)
}
function r8() {
    ANALYTICS_ENABLED && _gaTrack("send", "event", "basic", "started", partnerName, 1)
}
function r5() {
    ANALYTICS_ENABLED && _gaTrack("send", "event", "basic", "play", partnerName, 1)
}
function analyticsOnNextLevelContinue() {
    ANALYTICS_ENABLED && _gaTrack("send", "event", "basic", "playNext", partnerName, 1)
}
;var r40 = Phaser.Easing.Cubic.InOut;
function r100(a) {
    return Math.floor(Math.random() * a)
}
function r117(a) {
    return Math.floor(Math.random() * a) * (50 < r100(100) ? -1 : 1)
}
function r26(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a
}
function r33(a, b) {
    return r26(a, b) * (50 < r100(100)) ? -1 : 1
}
String.prototype.replaceAll = function(a, b) {
    return this.split(a).join(b)
}
;
function LOG(a) {}
Array.prototype.contains = function(a) {
    for (var b = this.length; b--; )
        if (this[b] === a)
            return !0;
    return !1
}
;
function r48(a, b) {
    return Math.round(a.width * b) / a.width
}
function r49(a, b) {
    return Math.round(a.height * b) / a.height
}
function r50(a) {
    a = (a || navigator.userAgent).toLowerCase();
    return (a = a.match(/android\s([0-9\.]*)/)) ? a[1] : !1
}
function r41(a, b, c) {
    for (a.style.font = b + "px gameFont"; a.height > c; ) {
        b--;
        var d = a.style;
        d.font = b + "px gameFont";
        a.setStyle(d)
    }
}
function updateTextToWidth(a, b, c) {
    for (a.style.font = b + "px gameFont"; a.width > c; ) {
        b--;
        var d = a.style;
        d.font = b + "px gameFont";
        a.setStyle(d)
    }
}
;var r118 = "img_480/";
function r146(a) {
    a.load.text("lang_strings", "assets/dat/m.isr");
    a.load.image("inlogic_logo", "assets/" + r118 + "inl.png");
    a.load.image("btn", "assets/" + r118 + "btn.png");
    a.load.image("logo_large", "assets/" + r118 + "logo_large.png");
    a.load.image("idnet_y8", "assets/" + r118 + "06_Y8_logo_WhiteStroke.png");
    a.load.image("idnet", "assets/" + r118 + "06_id_net_logo_WhiteStroke.png")
}
function r147(a) {
    a.load.image("logo", "assets/" + r118 + "logo.png");
    a.load.image("lock_bg", "assets/" + r118 + "lock_bg.png");
    a.load.image("lock_on", "assets/" + r118 + "lock_on.png");
    a.load.image("lock_dots", "assets/" + r118 + "lock_dots.png");
    a.load.image("lock_stick", "assets/" + r118 + "lock_stick.png");
    a.load.spritesheet("language_on", "assets/" + r118 + "language_on.png", 120, 120);
    a.load.spritesheet("buttons_menu", "assets/" + r118 + "buttons_menu.png", 90, 90);
    a.load.spritesheet("buttons_play", "assets/" + r118 + "buttons_play.png", 140, 140);
    a.load.spritesheet("button_bg", "assets/" + r118 + "button_bg.png", 350, 90);
    a.load.spritesheet("dialog_bg", "assets/" + r118 + "dialog_bg.png", 50, 50)
}
function r148(a) {
    a.load.audio("sndWin", ["assets/audio/win.ogg", "assets/audio/win.mp3"]);
    a.load.audio("sndLose", ["assets/audio/lose.ogg", "assets/audio/lose.mp3"]);
    a.load.audio("sndHit", ["assets/audio/hit.ogg", "assets/audio/hit.mp3"])
}
;var Splash = function(a) {};
function r9() {
    LOG("r9()");
    r192("wrongRotation");
    if (null != r173)
        r173.r141()
}
function r10() {
    LOG("r10()");
    r193("wrongRotation");
    if (null != r173)
        r173.r130()
}
Splash.prototype = {
    preload: function() {
        this.game.stage.backgroundColor = r138;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = !0;
        this.scale.refresh();
        game.device.desktop || window.addEventListener("resize", function() {
            isIOS && navigator.userAgent.match("CriOS") ? r163() ? r10() : r9() : window.innerWidth > window.innerHeight ? r9() : r10()
        });
        this.scale.pageAlignHorizontally = !0;
        this.scale.refresh();
        r146(this.game)
    },
    create: function() {
        window.innerWidth > window.innerHeight && r9();
        this.game.time.events.add(250, this.r120, this)
    },
    r119: function() {
        this.logo.inputEnabled = !0;
        this.logo.events.onInputDown.add(this.r120, this);
        this.r120()
    },
    r182: function() {
        game.add.tween(this.logo).to({
            alpha: 0
        }, 1E3, r40, !0, 0, 0, !1)
    },
    r120: function() {
        r8();
        this.game.state.start("PreloadState")
    }
};
var r169 = function(a) {}, r149, r150;
r169.prototype = {
    preload: function() {
        this.game.stage.backgroundColor = r138;
        r150 = this;
        r149 = this.game.world.height / 5 * 4.5;
        imgSplash = this.game.add.sprite(game.width / 2, game.height / 2, "logo_large");
        imgSplash.anchor.x = .5;
        imgSplash.anchor.y = .5;
        imgBtn = this.game.add.sprite(game.width / 2, game.height / 2, "btn");
        imgBtn.anchor.set(.5);
        imgBtn.scale.x = game.width / 100 + .2;
        imgBtn.scale.y = game.height / 100 + .2;
        new r167;
        percentageText = this.game.add.text(this.game.world.centerX, this.game.height - 30, "0 %", {
            font: "35px gameFont",
            fill: "#FFFFFF"
        });
        percentageText.anchor.set(.5);
        this.game.load.onFileComplete.add(this.r121, this);
        r147(this.game);
        r148(this.game);
        this.r27();
        window.addEventListener("resize", function() {});
        createIDNETbutton(10, game.height - 10, 0, 1);
        createY8button(game.width - 10, game.height - 10, 1, 1)
    },
    r121: function(a, b, c, d, e) {
        percentageText.text = a + " %"
    },
    create: function() {
        game_load_done = !0
    },
    update: function() {
        !1 === game_preload_create_started && this._create()
    },
    _create: function() {
        !1 !== game_load_done && !1 !== idnet_load_done && (game_preload_create_started = !0,
        this.r170())
    },
    r90: function(a, b, c) {
        a = new Phaser.Text(game,a,b,c,{
            fill: "#FED87F"
        });
        a.anchor.x = r48(a, .5);
        a.anchor.y = r49(a, .5);
        a.shadowOffsetX = 3;
        a.shadowOffsetY = 3;
        a.shadowColor = "#660000";
        return a
    },
    r27: function() {
        r167.instance.language = "en";
        var a = navigator.userLanguage || navigator.language
          , a = a.toLowerCase();
        -1 != a.indexOf("fr") && (r167.instance.language = "fr");
        -1 != a.indexOf("it") && (r167.instance.language = "it");
        -1 != a.indexOf("de") && (r167.instance.language = "de");
        -1 != a.indexOf("es") && (r167.instance.language = "es");
        -1 != a.indexOf("pt") && (r167.instance.language = "pt")
    },
    r102: function() {
        this.r170()
    },
    r170: function() {
        imgSplash.events.onInputDown.dispose();
        this.game.world.remove(imgSplash);
        this.game.state.start("SaveSelectionState")
    }
};
var onlineSave = !1
  , SaveSelection = function() {};
SaveSelection.prototype = {
    preload: function() {
        SaveSelection.instance = this
    },
    create: function() {
        this.create3x3WindowBitmap(game.width / 2 - 20, 300, "windBitmap");
        this.createIDNETloginScreen();
        var a = this;
        ID.getLoginStatus(function(b) {
            a.SceneLoginIDNETUpdateLoginDetails(b);
            a.showIdnetLoginScreen()
        })
    },
    createIDNETloginScreen: function() {
        this.grpSceneLoginIDNET = game.add.group();
        this.grpSceneLoginIDNET.name = "grpSceneLoginIDNET";
        var a = game.make.sprite(0, 0, game.cache.getBitmapData("windBitmap"));
        setObjectAnchor(a, .5, 0);
        a.visibleX = game.width / 4;
        (a.hiddenX = -game.width / 4).isClickable = !0;
        a.y = (game.height - a.height) / 2;
        a.isClickable = !0;
        a.events.onInputDown.add(this.idnetLoginOnlineSaveClicked, this);
        this.grpSceneLoginIDNET.onlineWind = this.grpSceneLoginIDNET.addChild(a);
        this.addShowTween(a, a, {
            x: a.visibleX
        }, 250, Phaser.Easing.Quintic.Out, 100, null, function() {
            this.checkShowScreenOver(this.grpSceneLoginIDNET, this)
        }, this);
        this.addHideTween(a, a, {
            x: a.hiddenX
        }, 250, Phaser.Easing.Quintic.Out, 0, null, function() {
            this.checkHideScreenOver(this.grpSceneLoginIDNET, this)
        }, this);
        a.addChild(createIDNETbutton(0, 25, .5, 0));
        var b = game.make.text(0, 120, "LOGIN TO USE\nONLINE SAVE", {
            font: "18px gameFont",
            fill: "#FFFFFF",
            align: "center"
        });
        setObjectAnchor(b, .5, 0);
        this.grpSceneLoginIDNET.onlineSaveText = a.addChild(b);
        this.grpSceneLoginIDNET.textMaxWidth = 1.1 * a.width;
        this.updateTextToWidth(a, 25, this.grpSceneLoginIDNET.textMaxWidth);
        b = game.make.text(0, 0, "ONLINE SAVE", {
            font: "22px gameFont",
            fill: "#FFFFFF",
            align: "center"
        });
        b.y = a.height - b.height - 20;
        setObjectAnchor(b, .5, 0);
        a.addChild(b);
        b = game.make.sprite(0, 0, game.cache.getBitmapData("windBitmap"));
        setObjectAnchor(b, .5, 0);
        b.visibleX = 3 * game.width / 4;
        b.hiddenX = game.width + game.width / 4;
        b.y = (game.height - b.height) / 2;
        b.isClickable = !0;
        b.events.onInputDown.add(this.idnetLoginLocalSaveClicked, this);
        this.grpSceneLoginIDNET.offlineWind = this.grpSceneLoginIDNET.addChild(b);
        this.addShowTween(b, b, {
            x: b.visibleX
        }, 250, Phaser.Easing.Quintic.Out, 100, null, function() {
            this.checkShowScreenOver(this.grpSceneLoginIDNET, this)
        }, this);
        this.addHideTween(b, b, {
            x: b.hiddenX
        }, 250, Phaser.Easing.Quintic.Out, 0, null, function() {
            this.checkHideScreenOver(this.grpSceneLoginIDNET, this)
        }, this);
        var c = game.make.text(0, 65, "GAME PROGRESS\nWILL BE SAVED LOCAL\nIN YOUR COMPUTER", {
            font: "17px gameFont",
            fill: "#FFFFFF",
            align: "center"
        });
        setObjectAnchor(c, .5, 0);
        b.addChild(c);
        this.updateTextToWidth(c, 25, .9 * b.width);
        c = game.make.text(0, 0, "LOCAL SAVE", {
            font: "22px gameFont",
            fill: "#FFFFFF",
            align: "center"
        });
        c.y = a.height - c.height - 20;
        setObjectAnchor(c, .5, 0);
        b.addChild(c);
        this.grpSceneLoginIDNET.openScrFunc = this.showIdnetLoginScreen;
        this.grpSceneLoginIDNET.openScrOverFunc = this.showIdnetLoginScreenOver;
        this.grpSceneLoginIDNET.closeScrFunc = this.hideIdnetLoginScreen;
        this.grpSceneLoginIDNET.closeScrOverFunc = this.hideIdnetLoginScreenOver;
        this.grpSceneLoginIDNET.visible = !1
    },
    SceneLoginIDNETUpdateLoginDetails: function(a) {
        "ok" === a.status && (this.grpSceneLoginIDNET.onlineSaveText.setText("WELCOME\n" + a.authResponse.details.nickname),
        this.updateTextToWidth(this.grpSceneLoginIDNET.onlineSaveText, 25, .9 * this.grpSceneLoginIDNET.onlineWind.width))
    },
    idnetLoginOnlineSaveClicked: function() {
        var a = this;
        "undefined" != typeof ID && ID.login(function(b) {
            idnet_debug && console.log(b);
            idnet_debug && console.log(b.authResponse.details);
            a.onpressedIDNETloginOnlineSaveCallback()
        })
    },
    onpressedIDNETloginOnlineSaveCallback: function() {
        onlineSave = !0;
        idnetLoadData(this.onpressedIDNETloginOnlineSaveCallback2)
    },
    onpressedIDNETloginOnlineSaveCallback2: function() {
        console.log("ab", this);
        this.initGame()
    },
    idnetLoginLocalSaveClicked: function() {
        onlineSave = !1;
        loadLocalGameData();
        this.initGame()
    },
    initGame: function() {
        this.hideIdnetLoginScreen()
    },
    showIdnetLoginScreen: function() {
        this.setButtonsInput(this.grpSceneLoginIDNET, !1);
        this.grpSceneLoginIDNET.onlineWind.x = this.grpSceneLoginIDNET.onlineWind.hiddenX;
        this.grpSceneLoginIDNET.offlineWind.x = this.grpSceneLoginIDNET.offlineWind.hiddenX;
        this.showScreenCustomTweens(this.grpSceneLoginIDNET)
    },
    showIdnetLoginScreenOver: function() {
        this.setButtonsInput(this.grpSceneLoginIDNET, !0)
    },
    hideIdnetLoginScreen: function(a) {
        this.setButtonsInput(this.grpSceneLoginIDNET, !1);
        this.grpSceneLoginIDNET.hideOverClbck = a;
        this.hideScreenCustomTweens(this.grpSceneLoginIDNET)
    },
    hideIdnetLoginScreenOver: function() {
        this.grpSceneLoginIDNET.visible = !1;
        game.state.start("r176")
    },
    showScreenCustomTweens: function(a) {
        a.visible = !0;
        for (var b = a.tweenCallbacksCount = 0; b < a.length; b++)
            if (1 == a.getChildAt(b).showTW instanceof Array)
                for (var c = 0; c < a.getChildAt(b).showTW.length; c++)
                    0 != a.getChildAt(b).anim && (a.getChildAt(b).showTW[c].start(),
                    a.tweenCallbacksCount++);
            else
                void 0 != a.getChildAt(b).showTW && 0 != a.getChildAt(b).anim && (a.getChildAt(b).showTW.start(),
                a.tweenCallbacksCount++)
    },
    hideScreenCustomTweens: function(a) {
        for (var b = a.tweenCallbacksCount = 0; b < a.length; b++)
            if (1 == a.getChildAt(b).hideTW instanceof Array)
                for (var c = 0; c < a.getChildAt(b).hideTW.length; c++)
                    a.getChildAt(b).hideTW[c].start();
            else
                void 0 != a.getChildAt(b).hideTW && 0 != a.getChildAt(b).anim && (a.getChildAt(b).hideTW.start(),
                a.tweenCallbacksCount++)
    },
    addShowTween: function(a, b, c, d, e, f, g, h, k) {
        b = game.add.tween(b).to(c, d, e, !1, f);
        null != g && b.onComplete.addOnce(g, k);
        null != h && b.onComplete.add(h, k);
        void 0 == a.showTW && (a.showTW = []);
        a.showTW.push(b)
    },
    addHideTween: function(a, b, c, d, e, f, g, h, k) {
        a.hideTW = game.add.tween(b).to(c, d, e, !1, f);
        null != g && a.hideTW.onComplete.addOnce(g, k);
        null != h && a.hideTW.onComplete.add(h, k)
    },
    checkShowScreenOver: function(a, b) {
        a.tweenCallbacksCount--;
        0 > a.tweenCallbacksCount ? LOG("vela show tweenov:", a.name) : 0 == a.tweenCallbacksCount && (LOG("checkShowScreenOver:", a.name),
        a.openScrOverFunc.call(b))
    },
    checkHideScreenOver: function(a, b) {
        a.tweenCallbacksCount--;
        0 > a.tweenCallbacksCount ? LOG("vela hide tweenov:", a.name) : 0 == a.tweenCallbacksCount && (LOG("checkHideScreenOver:", a.name),
        a.closeScrOverFunc.call(b),
        void 0 != a.hideOverClbck && a.hideOverClbck.call(this))
    },
    updateTextToWidth: function(a, b, c) {
        for (a.fontSize = b; a.width > c; )
            b--,
            a.fontSize = b
    },
    create3x3WindowBitmap: function(a, b, c) {
        function d(a, b, c) {
            a = game.make.image(0, 0, "dialog_bg", a);
            e.draw(a, b, c)
        }
        a = Math.floor(a / 50);
        b = Math.floor(b / 50);
        var e = game.add.bitmapData(50 * a, 50 * b);
        d(0, 0, 0);
        d(2, 50 * (a - 1), 0);
        d(6, 0, 50 * (b - 1));
        d(8, 50 * (a - 1), 50 * (b - 1));
        for (var f = 1; f < a - 1; f++)
            d(1, 50 * f, 0),
            d(7, 50 * f, 50 * (b - 1));
        for (f = 1; f < b - 1; f++)
            d(3, 0, 50 * f),
            d(5, 50 * (a - 1), 50 * f);
        for (f = 1; f < b - 1; f++)
            for (var g = 1; g < a - 1; g++)
                d(4, 50 * g, 50 * f);
        if (null != c)
            game.cache.addBitmapData(c, e);
        else
            return e
    },
    setButtonsInput: function(a, b) {
        var c = function(a) {
            for (var e = 0; e < a.children.length; e++) {
                var f = a.getChildAt(e);
                f.inputEnabled = !1;
                1 == f.isClickable && (f.inputEnabled = b,
                f.tint = 16777215);
                0 < a.getChildAt(e).children.length && c(a.getChildAt(e))
            }
        };
        c(a)
    }
};
function setObjectAnchor(a, b, c) {
    null != b && (a.anchor.x = r48(a, b));
    null != c && (a.anchor.y = r49(a, c))
}
;var r138 = 47245, r171 = 16205919, r57 = 2.5, r12 = 8, r13 = 12, r21 = 10, r103 = 60, r122 = new SoundManager(game), r172, r173, r51, r123, r72, r28, r104, r105, r106, r29, r58, r124, r151 = null, r125 = null, r174 = 0, r126, r73, r107, r59, r60, r34, r175 = [], r152 = [], r91 = null, r153, r35, r183, r42, r4, r61, r22, r139 = !1, firstGame = !0, score = 0, level = 1, r176 = function(a) {};
function r128(a) {
    for (var b = a.length, c, d; 0 !== b; )
        d = Math.floor(Math.random() * b),
        --b,
        c = a[b],
        a[b] = a[d],
        a[d] = c;
    return a
}
r176.prototype = {
    preload: function() {},
    create: function() {
        this.game.stage.backgroundColor = r138;
        this.game.renderer.renderSession.roundPixels = !0;
        UseTimeEvents = !1;
        r173 = this;
        r122.create();
        r172 = new Particles;
        this.r66();
        this.r76();
        this.r44();
        this.r30();
        this.r17();
        this.r38();
        this.r79();
        this.r77();
        this.game.input.keyboard.onDownCallback = function(a) {
            imgGameBtn.inputEnabled && r173.r62();
            r123.visible && !game.tweens.isTweening(r123) && r173.r111()
        }
        ;
        grpPrevLangScene = r123;
        this.r36(r123);
        this.r63(r104);
        game.onPause.add(this.r141, this);
        game.onResume.add(this.r130, this);
        r3();
        this.createIDNETbuttons();
        this.IDNETbuttons_show()
    },
    createIDNETbuttons: function() {
        this.idnbtn = createIDNETbutton(10, game.height - 10, 0, 1);
        this.idnbtn.scale.set(.8);
        this.y8btn = createY8button(game.width - 10, game.height - 10, 1, 1);
        this.y8btn.scale.set(.8)
    },
    IDNETbuttons_show: function() {
        game.tweens.removeFrom(this.idnbtn, !0);
        game.tweens.removeFrom(this.y8btn, !0);
        this.idnbtn.inputEnabled = !0;
        game.add.tween(this.idnbtn).to({
            alpha: 1
        }, 250, Phaser.Easing.Linear.None, !0);
        game.add.tween(this.y8btn).to({
            alpha: 1
        }, 250, Phaser.Easing.Linear.None, !0)
    },
    Y8btn_show: function() {
        game.tweens.removeFrom(this.y8btn, !0);
        game.add.tween(this.y8btn).to({
            alpha: 1,
            x: game.width - 10
        }, 150, Phaser.Easing.Linear.None, !0);
        game.add.tween(this.y8btn.scale).to({
            x: 1,
            y: 1
        }, 150, Phaser.Easing.Linear.None, !0)
    },
    IDNETbuttons_hide: function() {
        game.tweens.removeFrom(this.idnbtn, !0);
        this.idnbtn.inputEnabled = !1;
        game.tweens.removeFrom(this.y8btn, !0);
        game.add.tween(this.idnbtn).to({
            alpha: 0
        }, 250, Phaser.Easing.Linear.None, !0);
        game.add.tween(this.y8btn).to({
            alpha: 0
        }, 250, Phaser.Easing.Linear.None, !0)
    },
    update: function() {
        if (0 < r174) {
            var a = r117(r174 / 60)
              , b = r117(r174 / 60);
            r104.x = a;
            r104.y = b;
            r105.x = a;
            r105.y = b;
            r174 -= game.time.elapsedMS;
            if (0 >= r174) {
                r104.x = 0;
                r104.y = 0;
                r105.x = 0;
                r105.y = 0;
                r173.r92();
                return
            }
        }
        if (r139 && null != r125) {
            r125.rotation += lockStickSpd * game.time.elapsedMS / 1E3;
            a = Phaser.Math.radToDeg(r151.rotation) % 360;
            0 > a && (a += 360);
            b = Phaser.Math.radToDeg(r125.rotation) % 360;
            0 > b && (b += 360);
            var c = this.r112(b, a);
            lockStickOver ? c > r21 && (LOG("S:" + b + ", D: " + a + ", SPD: " + lockStickSpd + ", DSP: " + c),
            this.Failed()) : c <= r21 && (lockStickOver = !0)
        }
    },
    Failed: function() {
        btnPlay.frame = 2;
        btnPlay.cachedTint = -1;
        r122.r166(r145);
        r139 = !1;
        r174 = 500;
        game.stage.backgroundColor = r171;
        r173.gameOver("fail");
        this.IDNETbuttons_show()
    },
    r62: function() {
        if (r139) {
            var a = Phaser.Math.radToDeg(r151.rotation) % 360;
            0 > a && (a += 360);
            var b = Phaser.Math.radToDeg(r125.rotation) % 360;
            0 > b && (b += 360);
            var c = this.r112(b, a);
            r122.r166(r165);
            c > r21 ? (LOG("S:" + b + ", D: " + a + ", SPD: " + lockStickSpd + ", DSP: " + c),
            this.Failed()) : (this.calculateHitScore(c),
            lockCount--,
            txtGameLocksCount.text = "" + lockCount,
            updateTextToWidth(txtGameLocksCount, 140, 170),
            0 == lockCount ? (r122.r166(r164),
            level++,
            saveAllGameData(),
            twnLockOn.start(),
            r139 = !1,
            imgGameBtn.inputEnabled = !1,
            btnPlay.frame = 0,
            btnPlay.cachedTint = -1,
            r173.gameOver("win")) : (lockStickSpd = (0 > lockStickSpd ? 1 : -1) * (r57 + game.rnd.integerInRange(r12, r13) / 10),
            r173.r129(),
            lockStickOver = !1))
        } else
            txtTapToStart.visible && (txtTapToStart.visible = !1,
            r139 = !0,
            this.IDNETbuttons_hide())
    },
    gameOver: function(a) {
        if (!0 === onlineSave) {
            var b = {
                table: "highscoreTable",
                points: level
            };
            "undefined" !== typeof ID && ID.GameAPI.Leaderboards.save(b, function() {
                idnet_debug && console.log("Save successful")
            })
        }
        r173.showAdvertAfterGameOver(a)
    },
    r129: function() {
        var a = r21;
        do {
            r151.rotation = game.rnd.integerInRange(0, 360);
            a = Phaser.Math.radToDeg(r151.rotation) % 360;
            0 > a && (a += 360);
            var b = Phaser.Math.radToDeg(r125.rotation) % 360;
            0 > b && (b += 360);
            a = this.r112(b, a)
        } while (a <= r103)
    },
    r92: function() {
        r173.IDNETbuttons_show();
        r173.r93(sprMenuLogo);
        r173.r36(r123);
        r173.r94(r105)
    },
    calculateHitScore: function(a) {
        score += Math.round(10 * (r21 - a))
    },
    r141: function() {},
    r130: function() {},
    showAdvertAfterGameOver: function(a) {},
    r93: function(a, b) {
        void 0 === b && (b = 0);
        game.tweens.removeFrom(a, !0);
        a.visible = !0;
        a.alpha = 0;
        game.add.tween(a).to({
            alpha: 1
        }, 200, Phaser.Easing.Linear.In, !0, b)
    },
    r158: function(a, b, c) {
        game.tweens.removeFrom(a, !0);
        a.visible = !0;
        a.x = game.width * (b ? -2 : 2);
        a.y = 0;
        game.add.tween(a).to({
            x: 0
        }, 500, Phaser.Easing.Bounce.In, !0)
    },
    r52: function(a, b) {
        void 0 === b && (b = 0);
        this.r158(a, !0, b)
    },
    r159: function(a, b, c) {
        void 0 === c && (c = 0);
        game.tweens.removeFrom(a, !0);
        a.visible = !0;
        a.x = 0;
        a.y = game.height * (b ? -2 : 2);
        game.add.tween(a).to({
            y: 0
        }, 500, Phaser.Easing.Bounce.In, !0, c)
    },
    r63: function(a, b) {
        this.r159(a, !0)
    },
    r36: function(a, b) {
        this.r159(a, !1)
    },
    r43: function(a, b) {
        this.r158(a, !1)
    },
    r94: function(a, b) {
        void 0 === b && (b = 0);
        game.tweens.removeFrom(a, !0);
        var c = game.add.tween(a);
        c.to({
            alpha: 0
        }, 300, Phaser.Easing.Linear.Out, b);
        c.onComplete.add(this.r109, {
            hiddenScene: a
        });
        c.start()
    },
    r160: function(a, b, c) {
        void 0 === c && (c = 0);
        game.tweens.removeFrom(a, !0);
        var d = game.add.tween(a);
        d.to({
            x: game.width * (b ? -2 : 2)
        }, 500, Phaser.Easing.Bounce.Out, c);
        d.onComplete.add(this.r109, {
            hiddenScene: a
        });
        d.start()
    },
    r75: function(a, b) {
        this.r160(a, !0)
    },
    r64: function(a, b) {
        this.r160(a, !1)
    },
    r161: function(a, b, c) {
        game.tweens.removeFrom(a, !0);
        c = game.add.tween(a);
        c.to({
            y: game.height * (b ? -2 : 2)
        }, 500, Phaser.Easing.Bounce.Out);
        c.onComplete.add(this.r109, {
            hiddenScene: a
        });
        c.start()
    },
    r95: function(a, b) {
        this.r161(a, !0)
    },
    r53: function(a, b) {
        this.r161(a, !1)
    },
    r109: function() {
        LOG("r109 : " + this.hiddenScene.name);
        this.hiddenScene.visible = !1
    },
    r30: function() {
        r51 = game.add.group();
        var a = game.height / 2, b;
        b = r51.create(Math.round(game.width / 2), a, "language_on", 3);
        b.anchor.set(.5);
        this.r78(b, this.r83, this.r55, this.r67);
        b = r51.create(Math.round(game.width / 2 - 110), a, "language_on", 0);
        b.anchor.set(.5);
        this.r78(b, this.r81, this.r55, this.r67);
        b = r51.create(Math.round(game.width / 2 + 110), a, "language_on", 5);
        b.anchor.set(.5);
        this.r78(b, this.r86, this.r55, this.r67);
        a += 110;
        b = r51.create(Math.round(game.width / 2 - 110), a, "language_on", 1);
        b.anchor.set(.5);
        this.r78(b, this.r82, this.r55, this.r67);
        b = r51.create(Math.round(game.width / 2), a, "language_on", 4);
        b.anchor.set(.5);
        this.r78(b, this.r84, this.r55, this.r67);
        b = r51.create(Math.round(game.width / 2 + 110), a, "language_on", 2);
        b.anchor.set(.5);
        this.r78(b, this.r85, this.r55, this.r67);
        btnFromLangToSubMenu = r51.create(btnSubMenuToMenu.x, btnSubMenuToMenu.y, "buttons_menu", 2);
        btnFromLangToSubMenu.anchor.set(1);
        btnFromLangToSubMenu.overFrame = 7;
        btnFromLangToSubMenu.outFrame = 2;
        this.r78(btnFromLangToSubMenu, this.r23, this.r55, this.r67);
        r51.visible = !1
    },
    r76: function() {
        r123 = game.add.group();
        var a = game.height - 195;
        btnPlay = r123.create(game.width / 2, a, "buttons_play", 0);
        btnPlay.anchor.set(.5);
        this.r78(btnPlay, this.r111, this.r55, this.r67);
        r104 = game.add.group();
        sprLockOn = r104.create(game.width / 2, game.height / 2 - 80, "lock_on");
        sprLockOn.anchor.x = .5;
        sprLockOn.anchor.y = 1;
        twnLockOn = game.add.tween(sprLockOn.position).to({
            y: game.height / 2 - 140
        }, 500, "Linear", !1, 100, 0, !1);
        twnLockOn.onComplete.add(r173.r92);
        sprLockBg = r104.create(game.width / 2, game.height / 2, "lock_bg");
        sprLockBg.anchor.set(.5);
        sprMenuLogo = r104.create(game.width / 2, game.height / 2, "logo");
        sprMenuLogo.anchor.set(.5);
        btnSubMenu = r123.create(game.width / 2 + 125, a, "buttons_menu", 1);
        btnSubMenu.anchor.set(.5);
        btnSubMenu.overFrame = 6;
        btnSubMenu.outFrame = 1;
        this.r78(btnSubMenu, this.r18, this.r55, this.r67);
        this.r65(r123, game.height - 105, "SHOW LEADERBOARD", function() {
            var a = {
                table: "highscoreTable"
            };
            "undefined" != typeof ID && ID.GameAPI.Leaderboards.list(a)
        }, this).getChildAt(0).fontSize = 30;
        r123.visible = !1;
        r104.visible = !1
    },
    r77: function() {
        r105 = game.add.group();
        txtGameLevel = new Phaser.Text(game,game.width / 2,50,"",{
            fill: "#FFFFFF",
            font: "45px gameFont",
            align: "center"
        });
        txtGameLevel.anchor.x = .5;
        txtGameLevel.anchor.y = .5;
        txtGameLevel.text = STR(23) + ": " + level;
        r104.addChild(txtGameLevel);
        r151 = r105.create(game.width / 2, game.height / 2, "lock_dots");
        r151.anchor.x = .5;
        r151.anchor.y = 3.4;
        r151.rotation = 40;
        r125 = r105.create(game.width / 2, game.height / 2, "lock_stick");
        r125.anchor.x = .5;
        r125.anchor.y = 2.93;
        r125.rotation = 10;
        txtGameLocksCount = new Phaser.Text(game,game.width / 2,game.height / 2 - 5,"5",{
            fill: "#FFFFFF",
            font: "140px gameFont",
            align: "center"
        });
        txtGameLocksCount.text = "5";
        txtGameLocksCount.anchor.x = .5;
        txtGameLocksCount.anchor.y = .5;
        r105.addChild(txtGameLocksCount);
        txtTapToStart = new Phaser.Text(game,game.width / 2,game.height - 120,"",{
            fill: "#FFFFFF",
            font: "45px gameFont",
            align: "center"
        });
        txtTapToStart.anchor.x = .5;
        txtTapToStart.anchor.y = .5;
        txtTapToStart.text = STR(22);
        updateTextToWidth(txtTapToStart, 45, .85 * game.width);
        r105.addChild(txtTapToStart);
        txtTapToStart.scale.set(.95);
        game.add.tween(txtTapToStart.scale).to({
            x: 1,
            y: 1
        }, 500, "Linear", !0, 1E3, -1, !0);
        imgGameBtn = r105.create(game.width / 2, game.height / 2, "btn");
        imgGameBtn.anchor.set(.5);
        imgGameBtn.scale.x = game.width / 100 + .2;
        imgGameBtn.scale.y = game.height / 100 + .2;
        imgGameBtn.events.onInputDown.add(this.r62, this);
        r105.visible = !1
    },
    r44: function() {
        r72 = game.add.group();
        var a = game.height / 2 - 50;
        btnr167 = this.r65(r72, a, STR(11), this.r46);
        a += 100;
        btnInstructions = this.r65(r72, a, STR(8), this.r24);
        btnToggleSounds = this.r65(r72, a + 100, STR(9) + " " + (r122.soundPlaying ? STR(15) : STR(16)), this.r97);
        btnSubMenuToMenu = r72.create(game.width / 2 - 130, game.height / 2 - 50 + 350, "buttons_menu", 2);
        btnSubMenuToMenu.anchor.set(1);
        btnSubMenuToMenu.overFrame = 7;
        btnSubMenuToMenu.outFrame = 2;
        this.r78(btnSubMenuToMenu, this.r19, this.r55, this.r67);
        r72.visible = !1
    },
    r65: function(a, b, c, d) {
        a = a.create(game.width / 2, b, "button_bg", 0);
        a.overFrame = 1;
        a.outFrame = 0;
        a.anchor.set(.5);
        this.r78(a, d, this.r55, this.r67);
        d = new Phaser.Text(game,0,0,c,{
            fill: "#FFFFFF",
            font: "38px gameFont",
            align: "center"
        });
        d.anchor.x = .5;
        d.anchor.y = .5;
        d.text = c;
        a.addChild(d);
        return a
    },
    r66: function() {
        r106 = game.add.group();
        r106.visible = !1
    },
    r17: function() {
        r28 = game.add.group();
        dlgInstructions = this.r98(r28, 50, game.width - 100, game.height - 250);
        txtInstructions = this.r69(dlgInstructions, dlgInstructions.height / 2 + 50, STR(28), dlgInstructions.width / 5 * 4);
        r41(txtInstructions, 28, game.height - 200);
        btnInstructionsToSubMenu = r28.create(game.width / 2 - 130, game.height - 200 + 100, "buttons_menu", 2);
        btnInstructionsToSubMenu.anchor.set(1);
        btnInstructionsToSubMenu.overFrame = 7;
        btnInstructionsToSubMenu.outFrame = 2;
        this.r78(btnInstructionsToSubMenu, this.r2, this.r55, this.r67);
        r28.visible = !1
    },
    r78: function(a, b, c, d) {
        a.inputEnabled = !0;
        a.events.onInputDown.add(this.r54, {
            button: a,
            callback: b
        });
        a.events.onInputOver.add(c, {
            button: a
        });
        a.events.onInputOut.add(d, {
            button: a
        })
    },
    r54: function() {
        this.button.tint = 16777215;
        this.callback();
        r122.r166(r165);
        r173.r67(this.button)
    },
    r55: function(a) {
        a = a || this.button;
        Phaser.Device.desktop && (void 0 === a.overFrame ? a.tint = 10066329 : a.frame = a.overFrame,
        a.cachedTint = -1)
    },
    r67: function(a) {
        a = a || this.button;
        Phaser.Device.desktop && (void 0 === a.outFrame ? a.tint = 16777215 : a.frame = a.outFrame,
        a.cachedTint = -1)
    },
    render: function() {},
    r96: function(a, b, c) {
        r175[a][b].loadTexture("cisla-neoznacene");
        r175[a][b].frame = c;
        r175[a][b].NUM = c
    },
    r38: function() {
        r58 = game.add.group();
        r58.visible = !1
    },
    r79: function() {
        LOG("r79[" + game.width + ", " + game.height + "]");
        posY = (game.height - game.cache.getImage("logo_large").height) / 2 + 20;
        r124 = game.add.group();
        imgLogo = r124.create(Math.round((game.width - game.cache.getImage("logo_large").width) / 2), posY, "logo_large");
        imgLogo.anchor.y = 1;
        r124.visible = !1
    },
    r80: function() {
        LOG("r80()");
        r192("adFullScreen")
    },
    r81: function() {
        language = "en";
        r173.r45()
    },
    r82: function() {
        language = "de";
        r173.r45()
    },
    r83: function() {
        language = "fr";
        r173.r45()
    },
    r84: function() {
        language = "es";
        r173.r45()
    },
    r85: function() {
        language = "pt";
        r173.r45()
    },
    r86: function() {
        language = "it";
        r173.r45()
    },
    r45: function() {
        try {
            localStorage.setItem("plck-lang", "" + language)
        } catch (a) {}
        r167.instance.language = language;
        this.r53(r51);
        this.r36(r72);
        this.r142();
        r99 = !0
    },
    r110: function(a, b) {
        a.text = b;
        a.cachedTint = -1;
        a.reset(a.x, a.y)
    },
    r142: function() {
        btnr167.getChildAt(0).text = STR(11);
        btnInstructions.getChildAt(0).text = STR(8);
        btnToggleSounds.getChildAt(0).text = STR(9) + " " + (r122.soundPlaying ? STR(15) : STR(16));
        txtInstructions.text = STR(28);
        txtTapToStart.text = STR(22);
        updateTextToWidth(txtTapToStart, 45, .85 * game.width);
        r41(txtInstructions, 28, game.height - 200)
    },
    r18: function() {
        game.stage.backgroundColor = r138;
        r173.r53(r123);
        r173.r95(r104);
        r173.r63(r124);
        r173.r36(r72)
    },
    r19: function() {
        r173.r53(r72);
        r173.r95(r124);
        r173.r36(r123);
        r173.r63(r104)
    },
    r23: function() {
        r173.r53(r51);
        r173.r36(r72)
    },
    r2: function() {
        r173.r53(r28, !0);
        r173.r63(r124);
        r173.r36(r72)
    },
    r111: function() {
        LOG("r111()");
        game.stage.backgroundColor = 47245;
        r173.r178();
        txtTapToStart.visible = !0;
        r173.r94(sprMenuLogo);
        r173.r53(r123);
        r173.r93(r105);
        firstGame ? (r5(),
        firstGame = !1) : analyticsOnNextLevelContinue()
    },
    r178: function() {
        r174 = 0;
        imgGameBtn.inputEnabled = !0;
        lockCount = level;
        txtGameLocksCount.text = "" + lockCount;
        updateTextToWidth(txtGameLocksCount, 140, 170);
        txtGameLevel.text = STR(23) + ": " + level;
        sprLockOn.y = game.height / 2 - 80;
        lockStickSpd = (50 > game.rnd.integerInRange(0, 100) ? 1 : -1) * (r57 + game.rnd.integerInRange(r12, r13) / 10);
        this.r129();
        lockStickOver = !1;
        score = 0
    },
    r6: function() {
        LOG("r6()");
        r173.r95(r124);
        r173.r53(r106);
        r173.r36(r105);
        r173.r68();
        r139 = !0;
        touchDelay = 1E3
    },
    r24: function() {
        LOG("r24()");
        r173.r53(r72);
        r173.r95(r124);
        r173.r36(r28)
    },
    r46: function() {
        LOG("r46()");
        r173.r53(r72);
        r173.r36(r51)
    },
    r97: function() {
        r122.r114(r122.previousSoundPlayed);
        btnToggleSounds.getChildAt(0).text = STR(9) + " " + (r122.soundPlaying ? STR(15) : STR(16));
        btnToggleSounds.cachedTint = -1
    },
    r56: function() {
        grpPrevLangScene = r123;
        r173.r53(grpPrevLangScene);
        r173.r63(r51)
    },
    r20: function() {
        grpPrevLangScene = r106;
        r173.r53(grpPrevLangScene);
        r173.r63(r51)
    },
    r87: function() {
        LOG("r87()");
        game.tweens.pauseAll()
    },
    r68: function() {
        LOG("r68()");
        game.tweens.resumeAll()
    },
    r98: function(a, b, c, d) {
        b = Math.round(b);
        a = new Phaser.Group(game,a);
        var e = (game.width - c) / 2
          , f = e + c;
        a.create(e, b, "dialog_bg", 0);
        a.create(f - 42, b, "dialog_bg", 2);
        c = Math.floor((c - 84) / 42);
        for (var g = 0; g < c; g++)
            a.create(e + 42 + 42 * g, b, "dialog_bg", 1);
        a.create(f - 84, b, "dialog_bg", 1);
        var h = (d - 84) / 42;
        for (j = 1; j < h; j++) {
            a.create(e, b + 42 * j, "dialog_bg", 3);
            a.create(f - 42, b + 42 * j, "dialog_bg", 5);
            for (g = 0; g < c; g++)
                a.create(e + 42 + 42 * g, b + 42 * j, "dialog_bg", 4);
            a.create(f - 84, b + 42 * j, "dialog_bg", 4)
        }
        a.create(e, b + d - 84, "dialog_bg", 3);
        a.create(f - 42, b + d - 84, "dialog_bg", 5);
        a.create(e, b + d - 42, "dialog_bg", 6);
        a.create(f - 42, b + d - 42, "dialog_bg", 8);
        for (g = 0; g < c; g++)
            a.create(e + 42 + 42 * g, b + d - 42, "dialog_bg", 7),
            a.create(e + 42 + 42 * g, b + d - 84, "dialog_bg", 4);
        a.create(f - 84, b + d - 42, "dialog_bg", 7);
        a.create(f - 84, b + d - 84, "dialog_bg", 4);
        return a
    },
    r69: function(a, b, c, d) {
        b = new Phaser.Text(game,game.world.centerX,b,c,{
            fill: "#FFFFFF",
            font: "28px gameFont",
            wordWrap: !0,
            wordWrapWidth: d,
            align: "center"
        });
        b.anchor.x = r48(b, .5);
        b.anchor.y = r49(b, .5);
        b.shadowOffsetX = 3;
        b.shadowOffsetY = 3;
        b.shadowColor = "#660000";
        a.addChild(b);
        game.world.bringToTop(b);
        return b
    },
    r179: function(a, b, c, d) {
        var e = {
            step: 0
        };
        d = game.add.tween(e).to({
            step: 100
        }, d);
        d.onUpdateCallback(function() {
            a.tint = Phaser.Color.interpolateColor(b, c, 100, e.step)
        });
        a.tint = b;
        d.start()
    },
    r31: function(a, b, c, d, e, f) {
        var g = {
            step: 0
        };
        f = game.add.tween(g).to({
            step: 10
        }, f);
        f.onUpdateCallback(function() {
            a.backgroundColor = Phaser.Color.interpolateColorWithRGB(b, c, d, e, 10, g.step)
        });
        a.backgroundColor = b;
        f.start()
    },
    r112: function(a, b) {
        var c = Math.abs(b - a) % 360;
        return 180 < c ? 360 - c : c
    }
};
function r192(a, b) {
    null == b && (b = !1);
    if (!game.device.desktop || b)
        document.getElementById(a).style.display = "block"
}
function r193(a, b) {
    null == b && (b = !1);
    if (!game.device.desktop || b)
        document.getElementById(a).style.display = "none"
}
;var r143 = 480
  , r144 = 800
  , r99 = !1
  , isIOS = !1
  , userAgent = navigator.userAgent || navigator.vendor || window.opera;
if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i))
    isIOS = !0;
var aspect = window.innerWidth / window.innerHeight;
console.log("[" + window.innerWidth + ", " + window.innerHeight + "] " + aspect);
var r32 = r50()
  , r39 = 4;
0 != r32 && (r39 = parseInt(r50(), 10));
var r180 = "gameFont";
4 > r39 && (r180 = "arial");
r143 = r144 * aspect + .5;
700 < r143 && (r143 = 700);
450 > r143 && (r143 = 450);
var r143 = Math.floor(r143)
  , r113 = null
  , r181 = null
  , r70 = null
  , r71 = null;
try {
    r113 = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10)
} catch (e$$6) {}
isIOS && (r70 = Phaser.CANVAS);
try {
    r181 = -1 < window.navigator.appVersion.indexOf("bdbrowser"),
    r71 = -1 < window.navigator.appVersion.indexOf("Version/4.0")
} catch (e$$7) {}
!Phaser.Device.desktop && (null != r181 && 1 == r181 || null != r71 && 1 == r71) && (r70 = Phaser.CANVAS);
if (RUNNING_ON_WP = -1 < navigator.userAgent.indexOf("Windows Phone"))
    r70 = Phaser.CANVAS;
var config = {
    width: r143,
    height: r144,
    renderer: r70
}
  , game = new Phaser.Game(r143,r144,r70,"");
game.forceSingleUpdate = !0;
game.state.add("SplashState", Splash);
game.state.add("PreloadState", r169);
game.state.add("SaveSelectionState", SaveSelection);
game.state.add("r176", r176);
game.state.start("SplashState");
function r163() {
    switch (window.orientation) {
    case 0:
    case 180:
        return !0
    }
    return !1
}
window.addEventListener("touchend", function() {
    null !== game && "running" !== game.sound.context.state && game.sound.context.resume()
}, !1);
window.addEventListener("contextmenu", function(a) {
    a.preventDefault()
});
var idnet_debug = !1;
function createIDNETbutton(a, b, c, d) {
    a = this.game.add.button(a, b, "idnet");
    a.anchor.set(c, d);
    a.onInputDown.add(function() {
        window.open("https://www.id.net/", "_blank").focus()
    });
    return a
}
function createY8button(a, b, c, d) {
    a = this.game.add.sprite(a, b, "idnet_y8");
    a.anchor.set(c, d);
    return a
}
function idnetLoadData(a) {
    ID.api("user_data/retrieve", "POST", {
        key: "gameData"
    }, function(b) {
        try {
            idnet_debug && console.log(b);
            var c = JSON.parse(b.jsondata);
            idnet_debug && console.log(c);
            parseLoadedData(c);
            a.call(SaveSelection.instance)
        } catch (d) {
            idnet_debug && console.log(d),
            a.call(SaveSelection.instance)
        }
    })
}
function saveAllGameData() {
    if (!1 === onlineSave)
        try {
            localStorage.setItem("palock", JSON.stringify({
                lvl: level,
                snd: r122.soundPlaying
            }))
        } catch (a) {}
    !0 === onlineSave && ID.api("user_data/submit", "POST", {
        key: "gameData",
        value: JSON.stringify({
            lvl: level,
            snd: r122.soundPlaying
        })
    }, function(a) {
        idnet_debug && console.log("save done")
    })
}
var game_load_done = !1
  , game_preload_create_started = !1
  , idnet_load_done = !1;
function loadLocalGameData() {
    try {
        var a = localStorage.getItem("palock");
        null !== a && (parsedData = JSON.parse(a),
        null !== parsedData && parseLoadedData(parsedData))
    } catch (b) {}
}
function parseLoadedData(a) {
    var b = a.lvl;
    null !== b && (level = b);
    b = a.snd;
    if (!0 === b || !1 === b)
        r122.soundPlaying = b
}
;
(function() {
    /**
     * Camera
     * @class
     */
    var Camera = function() {
        Camera.superClass.constructor.call(this);

        this.type = zen3d.OBJECT_TYPE.CAMERA;

        // view matrix
        this.viewMatrix = new zen3d.Matrix4();

        // projection matrix
        this.projectionMatrix = new zen3d.Matrix4();

        // camera frustum
        this.frustum = new zen3d.Frustum();

        // gamma space or linear space
        this.gammaFactor = 2.0;
    	this.gammaInput = false;
        this.gammaOutput = false;
        
        // Where on the screen is the camera rendered in normalized coordinates.
        this.rect = new zen3d.Vector4(0, 0, 1, 1);

        // frustum test
        this.frustumCulled = true;
    }

    zen3d.inherit(Camera, zen3d.Object3D);

    /**
     * set view by look at, this func will set quaternion of this camera
     */
    Camera.prototype.lookAt = function() {
        var m = new zen3d.Matrix4();

        return function lookAt(target, up) {

            m.lookAtRH(this.position, target, up);
            this.quaternion.setFromRotationMatrix(m);

        };
    }();

    /**
     * set orthographic projection matrix
     */
    Camera.prototype.setOrtho = function(left, right, bottom, top, near, far) {
        this.projectionMatrix.set(
            2 / (right - left), 0, 0, -(right + left) / (right - left),
            0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom),
            0, 0, -2 / (far - near), -(far + near) / (far - near),
            0, 0, 0, 1
        );
    }

    /**
     * set perspective projection matrix
     */
    Camera.prototype.setPerspective = function(fov, aspect, near, far) {
        this.projectionMatrix.set(
            1 / (aspect * Math.tan(fov / 2)), 0, 0, 0,
            0, 1 / (Math.tan(fov / 2)), 0, 0,
            0, 0, -(far + near) / (far - near), -2 * far * near / (far - near),
            0, 0, -1, 0
        );
    }

    /*
     * get world direction (override)
     * must call after world matrix updated
     */
    Camera.prototype.getWorldDirection = function() {

        var position = new zen3d.Vector3();
        var quaternion = new zen3d.Quaternion();
        var scale = new zen3d.Vector3();

        return function getWorldDirection(optionalTarget) {

            var result = optionalTarget || new zen3d.Vector3();

            this.worldMatrix.decompose(position, quaternion, scale);

            result.set(0, 0, -1).applyQuaternion(quaternion);

            return result;

        };
    }();

    var helpMatrix = new zen3d.Matrix4();

    Camera.prototype.updateMatrix = function() {
        Camera.superClass.updateMatrix.call(this);

        this.viewMatrix.getInverse(this.worldMatrix); // update view matrix

        helpMatrix.multiplyMatrices(this.projectionMatrix, this.viewMatrix); // get PV matrix
        this.frustum.setFromMatrix(helpMatrix); // update frustum
    }

    Camera.prototype.copy = function ( source, recursive ) {
		Camera.superClass.copy.call( this, source, recursive );

		this.viewMatrix.copy( source.viewMatrix );
		this.projectionMatrix.copy( source.projectionMatrix );

		return this;
	}

    zen3d.Camera = Camera;
})();
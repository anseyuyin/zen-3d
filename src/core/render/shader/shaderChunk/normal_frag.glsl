#ifdef USE_NORMAL
    #ifdef DOUBLE_SIDED
    	float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );
    #else
    	float flipNormal = 1.0;
    #endif
    #ifdef FLAT_SHADED
        // Workaround for Adreno/Nexus5 not able able to do dFdx( vViewPosition ) ...
    	vec3 fdx = vec3( dFdx( v_modelPos.x ), dFdx( v_modelPos.y ), dFdx( v_modelPos.z ) );
    	vec3 fdy = vec3( dFdy( v_modelPos.x ), dFdy( v_modelPos.y ), dFdy( v_modelPos.z ) );
    	vec3 N = normalize( cross( fdx, fdy ) );
    #else
        vec3 N = normalize(v_Normal) * flipNormal;
    #endif
    #ifdef USE_NORMAL_MAP
        vec3 normalMapColor = texture2D(normalMap, v_Uv).rgb;
        // for now, uv coord is flip Y
        mat3 tspace = tsn(N, -v_modelPos, vec2(v_Uv.x, 1.0 - v_Uv.y));
        // mat3 tspace = tbn(normalize(v_Normal), v_modelPos, vec2(v_Uv.x, 1.0 - v_Uv.y));
        N = normalize(tspace * (normalMapColor * 2.0 - 1.0));
    #elif defined(USE_BUMPMAP)
        N = perturbNormalArb(-v_modelPos, N, dHdxy_fwd(v_Uv));
    #endif
#endif
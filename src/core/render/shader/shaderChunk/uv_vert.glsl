#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(USE_SPECULARMAP) || defined(USE_EMISSIVEMAP) || defined(USE_ROUGHNESSMAP) || defined(USE_METALNESSMAP)
    v_Uv = a_Uv;
#endif

#ifdef USE_AOMAP
    v_Uv2 = a_Uv2;
#endif
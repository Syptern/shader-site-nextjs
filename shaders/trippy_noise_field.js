const fragmentShader = /* glsl */ `
// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

 uniform vec2 iResolution;
 uniform vec2 iMouse;
 uniform float iTime;
 uniform float iScroll;

 vec2 hash(vec2 p)// replace this by something better
{
    p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));
    return-1.+2.*fract(sin(p)*43758.5453123);
}

float noise(in vec2 p)
{
    const float K1=.366025404;// (sqrt(3)-1)/2;
    const float K2=.211324865;// (3-sqrt(3))/6;
    
    vec2 i=floor(p+(p.x+p.y)*K1);
    vec2 a=p-i+(i.x+i.y)*K2;
    float m=step(a.y,a.x);
    vec2 o=vec2(m,1.-m);
    vec2 b=a-o+K2;
    vec2 c=a-1.+2.*K2;
    vec3 h=max(.5-vec3(dot(a,a),dot(b,b),dot(c,c)),0.);
    vec3 n=h*h*h*h*vec3(dot(a,hash(i+0.)),dot(b,hash(i+o)),dot(c,hash(i+1.)));
    return dot(n,vec3(70.));
}

float noise_effect(in vec2 _st,in float _radius){
    vec2 dist=_st-noise(_st+iTime/20.);
    
    float _distance=length(dist);
    
    float scale=1.-cos(_distance/_radius*3.14*.5);
    
    return 1.+(scale-pow(scale,16.)*.980) ;
    
    // return 1.-smoothstep(_radius-(_radius*0.01),
    // _radius+(_radius*0.01),
    // dot(dist,dist)*4.0);
}

float noise_effect2(in vec2 _st,in float _radius){
    vec2 dist=(_st-noise(_st - +iTime/20.)) * 0.7;
    
    float _distance=length(dist);
    
    float scale=1.-cos(_distance/_radius*3.14*.5);
    
    return 1.+(scale-pow(scale,16.)*.980);
    
    // return 1.-smoothstep(_radius-(_radius*0.01),
    // _radius+(_radius*0.01),
    // dot(dist,dist)*4.0);
}


void main(){
    vec2 st=gl_FragCoord.xy/iResolution.x;
    vec2 mouse=iMouse.xy/iResolution.x;
    // vec2 mouse = vec2(0.5);
    vec2 di=st-mouse;//vector from center to current fragment
    
    float prop=iResolution.x/iResolution.y;
    
    float d=distance(st,mouse);
    float power=(1.*3.141592/.3)*(sin(iTime/4.)/2. + 0.5)*.5;
    
    float bind=.6;//radius of 1:1 effect
    // if (power > 0.0) bind = sqrt(dot(mouse, mouse));
    // else {if (prop < 1.0) bind = mouse.x; else bind = mouse.y;}//stick to borders

    
    float Time = iTime + (iScroll/ 1000.);
    
    st=st+(st*noise(vec2(st.x+sin(Time/20.),st.y+cos(Time/20.)))* (iScroll /100.))* 2.* pow(1. - (d), 2.);


    float pct=0.;
    float green=0.;
    float red;
    
    pct=distance(st,vec2(sin(Time),cos(Time)))/2.*noise(vec2(st.x/100.+sin(Time/2.),st.y/100.+cos(Time/2.)));
    green=distance(st,vec2(sin(Time-.5),cos(Time+6.5)))/2.;
    red=distance(st,vec2(sin(Time-.5),cos(Time+3.5)))/5.;
    
    //for round effect, not elliptical
    
    vec3 color=vec3(.3-pct,1.-green,1.-pct) * 0.5 * noise_effect2(st, 0.5) ; 
    
    // dark circle
    //*  circle(st, 0.1, mouse);
    
    gl_FragColor=vec4(color,1.);
}`;

export default fragmentShader;

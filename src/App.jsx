import * as THREE from 'three'
import { useRef, Suspense, useState } from 'react'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { Center, OrbitControls, Environment, Text3D } from '@react-three/drei'
import woof from './fonts/Ogg_Italic.json'
import matcap from './matcaps/matcap01.png'
import matcap2 from './matcaps/matcap09.png'
import matcap3 from './matcaps/matcap03.png'

extend({ TextGeometry })

const Donuts = ({ z }) => {
    const objRef = useRef()
    const textureLoader = new THREE.TextureLoader()
    const matcapTexture = textureLoader.load(matcap2)
    const objectMaterial = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture,
    })
    const objectGeometry = new THREE.TorusGeometry(0.2, 0.1, 20, 50)
    const { viewport, camera } = useThree()
    const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z])

    const [data] = useState({
        x: THREE.MathUtils.randFloatSpread(2),
        y: THREE.MathUtils.randFloatSpread(viewport.height),
        rX: Math.random() * Math.PI,
        rY: Math.random() * Math.PI,
        rZ: Math.random() * Math.PI,
    })

    useFrame((state) => {
        // const as = 19
        objRef.current.position.set(data.x * width, (data.y += 0.02), z)
        objRef.current.rotation.set(
            (data.rX += 0.001),
            (data.rY += 0.001),
            (data.rZ += 0.001)
        )
        if (data.y > height) data.y = -height
    })
    return (
        <mesh
            ref={objRef}
            geometry={objectGeometry}
            material={objectMaterial}
        />
    )
}

const Spheres = ({ z }) => {
    const objRef = useRef()
    const textureLoader = new THREE.TextureLoader()
    const matcapTexture = textureLoader.load(matcap3)
    const objectMaterial = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture,
    })
    const objectGeometry = new THREE.OctahedronGeometry(0.3, 0)
    const { viewport, camera } = useThree()
    const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z])

    const [data] = useState({
        x: THREE.MathUtils.randFloatSpread(2),
        y: THREE.MathUtils.randFloatSpread(viewport.height),
        rX: Math.random() * Math.PI,
        rY: Math.random() * Math.PI,
        rZ: Math.random() * Math.PI,
    })

    useFrame((state) => {
        // const as = 19
        objRef.current.position.set(data.x * width, (data.y += 0.02), z)
        objRef.current.rotation.set(
            (data.rX += 0.001),
            (data.rY += 0.001),
            (data.rZ += 0.001)
        )
        if (data.y > height) data.y = -height
    })
    return (
        <mesh
            ref={objRef}
            geometry={objectGeometry}
            material={objectMaterial}
        />
    )
}
const Text = () => {
    // const meshRef = useRef(null)
    // // parse fontface json with Three.js
    // const font = new FontLoader().parse(woof)
    // // config the font geometry
    // const fontOptions = {
    //     font,
    //     size: 0.4,
    //     height: 0.1,
    //     curveSegments: 4,
    //     bevelEnabled: true,
    //     bevelThickness: 0.07,
    //     bevelSize: 0.02,
    //     bevelOffset: 0.001,
    //     bevelSegments: 6,
    // }
    const textureLoader = new THREE.TextureLoader()
    const matcapTexture = textureLoader.load(matcap)
    // return (
    //     <Center>
    //         <mesh
    //             ref={meshRef}
    //             visible
    //             position={[0, 0, 0]}
    //             rotation={[0, 0, 0]}
    //         >
    //             <textGeometry args={['SAM SAM', fontOptions]} />
    //             <meshMatcapMaterial attach='material' matcap={matcapTexture} />
    //         </mesh>
    //     </Center>
    // )

    // using with DREI
    return (
        <Center>
            <Text3D
                font={woof}
                lineHeight={0.5}
                size={0.5}
                height={0.1}
                curveSegments={4}
                bevelEnabled={true}
                bevelThickness={0.07}
                bevelSize={0.02}
                bevelOffset={0.001}
                bevelSegments={6}
            >
                SamSam
                <meshMatcapMaterial matcap={matcapTexture} />
            </Text3D>
        </Center>
    )
}

export const App = ({ count = 1000, depth = 100 }) => {
    return (
        <Canvas
            gl={{ alpha: false }}
            camera={{ fov: 30, near: 0.01, far: 110 }}
            shadows
            dpr={[1, 2]}
        >
            <color attach='background' args={['#434343']} />
            <spotLight position={[10, 10, 10]} intensity={0.5} />
            <OrbitControls
                enableZoom={true}
                // zoomSpeed={2.0}
                enablePan={true}
                minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
                // autoRotateSpeed={1.0}
                enableDamping={true}
                dampingFactor={0.3}
            />
            <Environment preset='sunset' />
            <Suspense fallback={null}>
                <Text />
                {Array.from({ length: count }, (_, i) => (
                    <>
                        <Donuts key={i} z={-i} scale={0.5} />
                        <Spheres key={i} z={-i} scale={0.01} />
                    </>
                ))}
            </Suspense>
        </Canvas>
    )
}

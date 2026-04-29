import React, { useEffect, useRef } from 'react'
import {
  View, Text, Animated, StyleSheet,
  Dimensions, StatusBar
} from 'react-native'

const { width, height } = Dimensions.get('window')

export default function SplashScreen({ onFinish }) {
  // Animations
  const carX         = useRef(new Animated.Value(-180)).current
  const carY         = useRef(new Animated.Value(0)).current
  const logoOpacity  = useRef(new Animated.Value(0)).current
  const logoScale    = useRef(new Animated.Value(0.6)).current
  const subtitleOp   = useRef(new Animated.Value(0)).current
  const subtitleY    = useRef(new Animated.Value(20)).current
  const lineWidth    = useRef(new Animated.Value(0)).current
  const bgOpacity    = useRef(new Animated.Value(0)).current
  const exitOpacity  = useRef(new Animated.Value(1)).current
  const light1       = useRef(new Animated.Value(0.3)).current
  const light2       = useRef(new Animated.Value(0.3)).current
  const light3       = useRef(new Animated.Value(0.3)).current
  const roadLineOp   = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Traffic lights blinking
    Animated.loop(
      Animated.sequence([
        Animated.timing(light1, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(light1, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ])
    ).start()

    Animated.sequence([
      Animated.delay(200),
      Animated.loop(
        Animated.sequence([
          Animated.timing(light2, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(light2, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      )
    ]).start()

    Animated.sequence([
      Animated.delay(400),
      Animated.loop(
        Animated.sequence([
          Animated.timing(light3, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(light3, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      )
    ]).start()

    // Main sequence
    Animated.sequence([
      // Road appears
      Animated.timing(roadLineOp, { toValue: 1, duration: 300, useNativeDriver: true }),

      // Car drives in from left
      Animated.timing(carX, {
        toValue: width / 2 - 70,
        duration: 900,
        useNativeDriver: true,
      }),

      // Car bounces (parks)
      Animated.sequence([
        Animated.timing(carY, { toValue: -10, duration: 120, useNativeDriver: true }),
        Animated.timing(carY, { toValue: 4,   duration: 100, useNativeDriver: true }),
        Animated.timing(carY, { toValue: -4,  duration: 80,  useNativeDriver: true }),
        Animated.timing(carY, { toValue: 0,   duration: 80,  useNativeDriver: true }),
      ]),

      // Logo appears
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(logoScale,   { toValue: 1, friction: 6,   useNativeDriver: true }),
        Animated.timing(bgOpacity,   { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),

      // Line under logo
      Animated.timing(lineWidth, { toValue: 1, duration: 350, useNativeDriver: true }),

      // Subtitle
      Animated.parallel([
        Animated.timing(subtitleOp, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(subtitleY,  { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),

      Animated.delay(1200),

      // Fade out
      Animated.timing(exitOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),

    ]).start(() => onFinish?.())

  }, [])

  return React.createElement(Animated.View, { style: [s.container, { opacity: exitOpacity }] },
    React.createElement(StatusBar, { barStyle: 'light-content' }),

    // Background grid lines (parking lot effect)
    React.createElement(View, { style: s.bgGrid },
      ...Array.from({ length: 6 }).map((_, i) =>
        React.createElement(View, { key: i, style: [s.gridLine, { left: i * (width / 5) }] })
      )
    ),

    // Parking sign top
    React.createElement(View, { style: s.parkingSign },
      React.createElement(Text, { style: s.parkingSignText }, 'P')
    ),

    // Traffic lights
    React.createElement(View, { style: s.trafficLights },
      React.createElement(Animated.View, { style: [s.light, s.lightRed,    { opacity: light1 }] }),
      React.createElement(Animated.View, { style: [s.light, s.lightYellow, { opacity: light2 }] }),
      React.createElement(Animated.View, { style: [s.light, s.lightGreen,  { opacity: light3 }] }),
    ),

    // Road
    React.createElement(Animated.View, { style: [s.road, { opacity: roadLineOp }] },
      // Dashed center line
      ...Array.from({ length: 8 }).map((_, i) =>
        React.createElement(View, { key: i, style: [s.dashLine, { left: i * (width / 7) }] })
      )
    ),

    // Car 🚗
    React.createElement(Animated.View, {
      style: [s.carContainer, { transform: [{ translateX: carX }, { translateY: carY }] }]
    },
      React.createElement(Text, { style: s.carEmoji }, '🚗'),
      // Headlights glow
      React.createElement(View, { style: s.headlightLeft  }),
      React.createElement(View, { style: s.headlightRight }),
    ),

    // Logo block
    React.createElement(Animated.View, {
      style: [s.logoBlock, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]
    },
      React.createElement(View, { style: s.logoCircle },
        React.createElement(Text, { style: s.logoLetter }, 'P')
      ),
      React.createElement(Text, { style: s.logoTitle }, 'ParkCampus'),
    ),

    // Divider line
    React.createElement(Animated.View, {
      style: [s.divider, { transform: [{ scaleX: lineWidth }] }]
    }),

    // Subtitle
    React.createElement(Animated.Text, {
      style: [s.subtitle, { opacity: subtitleOp, transform: [{ translateY: subtitleY }] }]
    }, 'Gestion du parking universitaire'),

    // Bottom dots
    React.createElement(View, { style: s.dots },
      React.createElement(View, { style: [s.dot, s.dotActive] }),
      React.createElement(View, { style: s.dot }),
      React.createElement(View, { style: s.dot }),
    )
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1623',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // Background grid
  bgGrid: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  gridLine: {
    position: 'absolute', top: 0, bottom: 0, width: 1,
    backgroundColor: 'rgba(37,99,235,0.08)',
  },

  // Parking sign
  parkingSign: {
    position: 'absolute', top: 60, right: 30,
    width: 48, height: 48, borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#2563eb', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 12, elevation: 8,
  },
  parkingSignText: { color: '#fff', fontSize: 26, fontWeight: '900' },

  // Traffic lights
  trafficLights: {
    position: 'absolute', top: 55, left: 30,
    backgroundColor: '#1a2333',
    borderRadius: 12, padding: 8, gap: 6,
    borderWidth: 1, borderColor: '#253044',
  },
  light:       { width: 16, height: 16, borderRadius: 8, marginVertical: 2 },
  lightRed:    { backgroundColor: '#f87171' },
  lightYellow: { backgroundColor: '#fbbf24' },
  lightGreen:  { backgroundColor: '#22c55e' },

  // Road
  road: {
    position: 'absolute',
    bottom: height * 0.22,
    left: 0, right: 0, height: 70,
    backgroundColor: '#1a2333',
    borderTopWidth: 2, borderBottomWidth: 2,
    borderColor: '#253044',
    overflow: 'hidden',
  },
  dashLine: {
    position: 'absolute', top: '50%',
    width: width / 14, height: 3,
    backgroundColor: '#fbbf24',
    opacity: 0.6, borderRadius: 2,
  },

  // Car
  carContainer: {
    position: 'absolute',
    bottom: height * 0.225,
  },
  carEmoji: { fontSize: 52 },
  headlightLeft: {
    position: 'absolute', right: -4, top: 10,
    width: 14, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(251,191,36,0.4)',
  },
  headlightRight: {
    position: 'absolute', right: -4, bottom: 10,
    width: 14, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(251,191,36,0.4)',
  },

  // Logo
  logoBlock: { alignItems: 'center', marginBottom: 16 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 22,
    backgroundColor: '#2563eb',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#2563eb', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 10,
  },
  logoLetter: { color: '#fff', fontSize: 38, fontWeight: '900' },
  logoTitle:  { color: '#f1f5f9', fontSize: 32, fontWeight: '800', letterSpacing: 1 },

  // Divider
  divider: {
    width: 160, height: 2, borderRadius: 2,
    backgroundColor: '#2563eb', marginBottom: 14,
  },

  // Subtitle
  subtitle: {
    color: '#94a3b8', fontSize: 14,
    fontWeight: '600', letterSpacing: 0.5,
  },

  // Dots
  dots: { flexDirection: 'row', gap: 8, position: 'absolute', bottom: 50 },
  dot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: '#253044' },
  dotActive: { width: 24, backgroundColor: '#2563eb' },
})
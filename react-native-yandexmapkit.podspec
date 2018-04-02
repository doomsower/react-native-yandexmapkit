Pod::Spec.new do |s|
  s.name             = 'react-native-yandexmapkit'
  s.version          = '0.1.0'
  s.summary          = 'A React Native module that wraps Yandex Map Kit'
  s.requires_arc = true
  s.homepage         = 'https://github.com/doomsower/react-native-yandexmapkit'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'Konstantin Kuznetsov' => 'K.Kuznetcov@gmail.com' }
  s.source           = { :git => 'https://github.com/doomsower/react-native-yandexmapkit.git', :tag => s.version.to_s }

  s.source_files = 'ios/*.{h,m}'

  s.platform     = :ios, "7.0"

  s.dependency 'React'
  s.dependency 'YandexMapKit', '~> 1.0.9'
end

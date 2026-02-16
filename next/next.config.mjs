/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // 開発環境: ローカル Rails サーバー
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/rails/active_storage/**',
      },
      // Docker開発環境: Railsコンテナ
      {
        protocol: 'http',
        hostname: 'rails',
        port: '3000',
        pathname: '/rails/active_storage/**',
      },
      // 本番環境: バックエンドAPI（念のため）
      {
        protocol: 'https',
        hostname: 'backend.aozora-library.com',
        pathname: '/rails/active_storage/**',
      },
      // 本番環境: S3バケット（具体的に指定）
      {
        protocol: 'https',
        hostname: 'aozora-library-images.s3.ap-northeast-1.amazonaws.com',
        pathname: '/**',
      },
      // 本番環境: AWS S3（汎用パターン - 念のため）
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
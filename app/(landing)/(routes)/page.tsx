import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Users, Zap, TrendingUp, Gauge, Clock } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex-1  min-h-screen  w-full">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className=" px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  通过<span className="text-blue-500"> AgileDao </span>提升您的团队效率
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                 使用 Scrum 方法论，提升产品开发的敏捷性和效率。
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/workspace">
                  <Button>开始使用</Button>
                </Link>
                <Link href="/documentation">
                  <Button variant="outline">了解更多</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>



        {/* Product Features */}
        <section id="product-features" className="w-full py-16 md:py-28 lg:py-36 bg-gray-50 dark:bg-gray-800">
          <div className="px-6 md:px-8">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-center mb-10">
              产品功能
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <CheckCircle className="h-12 w-12 mb-4 text-green-500" />
                  <h3 className="text-xl font-bold mb-2">用户故事地图</h3>
                  <p className="text-center text-gray-500">通过用户故事地图，清晰地规划和展示用户旅程和产品功能。</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <Zap className="h-12 w-12 mb-4 text-yellow-500" />
                  <h3 className="text-xl font-bold mb-2">产品待办</h3>
                  <p className="text-center text-gray-500">管理和优先排序产品待办事项，确保团队专注于最重要的任务。</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <Users className="h-12 w-12 mb-4 text-blue-500" />
                  <h3 className="text-xl font-bold mb-2">Sprint 管理</h3>
                  <p className="text-center text-gray-500">有效规划和管理sprint，确保团队按时交付高质量的产品。</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <TrendingUp className="h-12 w-12 mb-4 text-purple-500" />
                  <h3 className="text-xl font-bold mb-2">Sprint Task管理</h3>
                  <p className="text-center text-gray-500">跟踪和管理sprint任务，确保团队高效协作和任务完成。</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <Clock className="h-12 w-12 mb-4 text-red-500" />
                  <h3 className="text-xl font-bold mb-2">工时管理</h3>
                  <p className="text-center text-gray-500">通过工时管理功能，记录和分析团队成员的工作时间，提高工作效率。</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <Gauge className="h-12 w-12 mb-4 text-indigo-500" />
                  <h3 className="text-xl font-bold mb-2">仪表盘</h3>
                  <p className="text-center text-gray-500">通过仪表盘查看燃尽图、当前sprint内容、任务分布和工作量。</p>
                </CardContent>
              </Card>
              
            </div>
          </div>
        </section>

        {/* Scrum Features */}
        <section id="features" className="w-full mx-auto py-12 md:py-24 lg:py-32 ">
          <div className=" px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-center mb-12">AgileDao 的主要特点</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <CheckCircle className="h-12 w-12 mb-4 text-green-500" />
                  <h3 className="text-xl font-bold mb-2">迭代开发</h3>
                  <p className="text-center text-gray-500">通过短期冲刺实现持续交付和快速反馈</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <Users className="h-12 w-12 mb-4 text-blue-500" />
                  <h3 className="text-xl font-bold mb-2">自组织团队</h3>
                  <p className="text-center text-gray-500">赋予团队权力，提高责任感和创新能力</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <TrendingUp className="h-12 w-12 mb-4 text-purple-500" />
                  <h3 className="text-xl font-bold mb-2">持续改进</h3>
                  <p className="text-center text-gray-500">通过回顾会议不断优化流程和产品</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Scrum */}
        <section id="why-scrum" className="w-full py-16 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
          <div className=" px-4 sm:px-6 md:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-8 sm:text-4xl md:text-5xl">为什么选择 AgileDao？</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mx-4 sm:mx-6 md:mx-8">
              <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-semibold">简洁与高效</h3>
                <p className="text-gray-600 dark:text-gray-300">洁的界面和精炼的功能，简化开发流程，降低认知负担，专注于任务完成。</p>
              </div>
              <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-semibold">专注与优先</h3>
                <p className="text-gray-600 dark:text-gray-300">设定短期目标和定期交付，确保团队专注于高优先级任务，避免分散注意力。</p>
              </div>
              <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-semibold">透明与协作</h3>
                <p className="text-gray-600 dark:text-gray-300">通过看板和燃尽图实时可视化工作进展，提升透明度和协作效率，使工作量更易预测</p>
              </div>
              <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-semibold">持续优化</h3>
                <p className="text-gray-600 dark:text-gray-300">定期回顾和反馈机制，帮助团队优化流程，提升产品质量和适应性。</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className=" px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-center mb-12">客户评价</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <p className="mb-4 italic">"采用 Agiledao 后，我们的产品交付速度提升了 40%，客户满意度显著提高。"</p>
                  <p className="font-bold">- Jhonny，技术总监</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="mb-4 italic">"Agiledao 使我们能够更高效地管理复杂产品开发，显著减少了交付延期。"</p>
                  <p className="font-bold">- William，项目经理</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="mb-4 italic">"使用 Agiledao 后，团队在产品开发中的协作更紧密，创新氛围更浓厚。"</p>
                  <p className="font-bold">- Ivan，开发团队负责人</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-500 text-primary-foreground">
          <div className=" px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">准备好提升您的团队效率了吗？</h2>
              <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl">
                立即使用 AgileDao，开启敏捷开发的全新篇章。
              </p>
              <Link href="/workspace">
              <Button variant="secondary" size="lg">
                免费试用 14 天
              </Button>
              </Link>
            </div>
          </div>
        </section>

    </div>
  )
}
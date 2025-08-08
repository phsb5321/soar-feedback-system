import { Logo } from "@/components/atoms/Logo/Logo";

export default function LogoShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Logo Component Showcase
          </h1>
          <p className="text-lg text-gray-700">
            Demonstrating different variants of the SOAR Logo component
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Size Variants */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h6 className="text-lg font-semibold mb-4 text-gray-800">
              Size Variants
            </h6>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-2">Small</p>
                <Logo size="small" />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-2">Medium</p>
                <Logo size="medium" />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-2">Large</p>
                <Logo size="large" />
              </div>
            </div>
          </div>

          {/* Theme Variants */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h6 className="text-lg font-semibold mb-4 text-gray-800">
              Theme Variants
            </h6>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-2">Gradient (Default)</p>
                <Logo theme="gradient" />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-2">Solid</p>
                <Logo theme="solid" />
              </div>
              <div className="text-center bg-gray-800 p-4 rounded">
                <p className="text-sm text-gray-300 mb-2">White (on dark)</p>
                <Logo theme="white" />
              </div>
            </div>
          </div>

          {/* Subtitle Variants */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h6 className="text-lg font-semibold mb-4 text-gray-800">
              Subtitle Options
            </h6>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-2">No Subtitle</p>
                <Logo showSubtitle={false} />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-2">Default Subtitle</p>
                <Logo showSubtitle={true} />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-2">Custom Subtitle</p>
                <Logo showSubtitle={true} subtitle="Custom Text Here" />
              </div>
            </div>
          </div>

          {/* Decoration Line */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h6 className="text-lg font-semibold mb-4 text-gray-800">
              Decoration Line
            </h6>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-2">
                  With Decoration Line
                </p>
                <Logo showDecorationLine={true} />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-2">No Decoration Line</p>
                <Logo showDecorationLine={false} />
              </div>
            </div>
          </div>
        </div>

        {/* Real Usage Examples */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h6 className="text-lg font-semibold mb-4 text-gray-800">
            Real Usage Examples
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-700 mb-4">Main Page Usage</p>
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-lg">
                <Logo
                  size="large"
                  showSubtitle={true}
                  subtitle="Sistema de Avaliação e Feedback"
                  showDecorationLine={true}
                  theme="gradient"
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-700 mb-4">CSAT Page Usage</p>
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-lg">
                <Logo
                  size="large"
                  showSubtitle={true}
                  subtitle="Avaliação e Feedback"
                  showDecorationLine={false}
                  theme="gradient"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

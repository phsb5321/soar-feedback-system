import { Logo } from "@/components/atoms/Logo/Logo";
import { Box, Paper, Typography } from "@mui/material";

export default function LogoShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Logo Component Showcase
          </h1>
          <p className="text-lg text-gray-600">
            Demonstrating different variants of the SOAR Logo component
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Size Variants */}
          <Paper elevation={3} className="p-6">
            <Typography variant="h6" className="mb-4 text-gray-800">
              Size Variants
            </Typography>
            <div className="space-y-6">
              <Box className="text-center">
                <p className="text-sm text-gray-600 mb-2">Small</p>
                <Logo size="small" />
              </Box>
              <Box className="text-center">
                <p className="text-sm text-gray-600 mb-2">Medium</p>
                <Logo size="medium" />
              </Box>
              <Box className="text-center">
                <p className="text-sm text-gray-600 mb-2">Large</p>
                <Logo size="large" />
              </Box>
            </div>
          </Paper>

          {/* Theme Variants */}
          <Paper elevation={3} className="p-6">
            <Typography variant="h6" className="mb-4 text-gray-800">
              Theme Variants
            </Typography>
            <div className="space-y-6">
              <Box className="text-center">
                <p className="text-sm text-gray-600 mb-2">Gradient (Default)</p>
                <Logo theme="gradient" />
              </Box>
              <Box className="text-center">
                <p className="text-sm text-gray-600 mb-2">Solid</p>
                <Logo theme="solid" />
              </Box>
              <Box className="text-center bg-gray-800 p-4 rounded">
                <p className="text-sm text-gray-300 mb-2">White (on dark)</p>
                <Logo theme="white" />
              </Box>
            </div>
          </Paper>

          {/* Subtitle Variants */}
          <Paper elevation={3} className="p-6">
            <Typography variant="h6" className="mb-4 text-gray-800">
              Subtitle Options
            </Typography>
            <div className="space-y-6">
              <Box className="text-center">
                <p className="text-sm text-gray-600 mb-2">No Subtitle</p>
                <Logo showSubtitle={false} />
              </Box>
              <Box className="text-center">
                <p className="text-sm text-gray-600 mb-2">Default Subtitle</p>
                <Logo showSubtitle={true} />
              </Box>
              <Box className="text-center">
                <p className="text-sm text-gray-600 mb-2">Custom Subtitle</p>
                <Logo showSubtitle={true} subtitle="Custom Text Here" />
              </Box>
            </div>
          </Paper>

          {/* Decoration Line */}
          <Paper elevation={3} className="p-6">
            <Typography variant="h6" className="mb-4 text-gray-800">
              Decoration Line
            </Typography>
            <div className="space-y-6">
              <Box className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  With Decoration Line
                </p>
                <Logo showDecorationLine={true} />
              </Box>
              <Box className="text-center">
                <p className="text-sm text-gray-600 mb-2">No Decoration Line</p>
                <Logo showDecorationLine={false} />
              </Box>
            </div>
          </Paper>
        </div>

        {/* Real Usage Examples */}
        <Paper elevation={3} className="p-6">
          <Typography variant="h6" className="mb-4 text-gray-800">
            Real Usage Examples
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Box className="text-center">
              <p className="text-sm text-gray-600 mb-4">Main Page Usage</p>
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-lg">
                <Logo
                  size="large"
                  showSubtitle={true}
                  subtitle="Sistema de Avaliação e Feedback"
                  showDecorationLine={true}
                  theme="gradient"
                />
              </div>
            </Box>
            <Box className="text-center">
              <p className="text-sm text-gray-600 mb-4">CSAT Page Usage</p>
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-lg">
                <Logo
                  size="large"
                  showSubtitle={true}
                  subtitle="Avaliação e Feedback"
                  showDecorationLine={false}
                  theme="gradient"
                />
              </div>
            </Box>
          </div>
        </Paper>
      </div>
    </div>
  );
}

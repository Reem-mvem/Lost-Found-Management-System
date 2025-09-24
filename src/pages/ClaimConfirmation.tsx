import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, Search, ArrowRight } from 'lucide-react';

interface Claim {
  id: string;
  trackingNumber: string;
  userDescription: string;
  contactInfo: string;
  timestamp: string;
  status: 'pending' | 'verified' | 'rejected';
}

const ClaimConfirmation: React.FC = () => {
  const { trackingNumber } = useParams();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load claim data
    const claims = JSON.parse(localStorage.getItem('claims') || '[]');
    const foundClaim = claims.find((c: Claim) => c.trackingNumber === trackingNumber);
    setClaim(foundClaim || null);
    setLoading(false);
  }, [trackingNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading claim information...</p>
        </div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-500 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Claim Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find a claim with tracking number: {trackingNumber}
          </p>
          <Link
            to="/claim"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Submit New Claim
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (claim.status) {
      case 'verified':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'rejected':
        return <CheckCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Clock className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (claim.status) {
      case 'verified':
        return {
          title: 'Claim Verified!',
          description: 'Great news! We found a match for your item. The venue will contact you shortly with pickup instructions.',
          color: 'text-green-600'
        };
      case 'rejected':
        return {
          title: 'No Match Found',
          description: 'Unfortunately, we couldn\'t find a matching item in our database at this time. Please check back later or submit a new claim.',
          color: 'text-red-600'
        };
      default:
        return {
          title: 'Claim Under Review',
          description: 'Our AI is searching for matches. We\'ll notify you via email when we have an update.',
          color: 'text-yellow-600'
        };
    }
  };

  const statusInfo = getStatusText();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Status Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
            <div className="flex items-center justify-center mb-4">
              {getStatusIcon()}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
              {statusInfo.title}
            </h1>
            <p className="text-blue-100 text-center text-lg">
              Tracking Number: {claim.trackingNumber}
            </p>
          </div>

          <div className="p-8">
            <div className={`text-center mb-8 ${statusInfo.color}`}>
              <p className="text-lg">{statusInfo.description}</p>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 rounded-full p-2 mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Claim Submitted</h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(claim.timestamp).toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Your claim has been received and is being processed.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className={`rounded-full p-2 mt-1 ${
                  claim.status !== 'pending' ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  <Search className={`h-4 w-4 ${
                    claim.status !== 'pending' ? 'text-green-600' : 'text-yellow-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Matching</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {claim.status !== 'pending' 
                      ? 'AI matching completed.' 
                      : 'Our AI is currently searching for matching items...'
                    }
                  </p>
                </div>
              </div>

              {claim.status === 'verified' && (
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 rounded-full p-2 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Match Found</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      A potential match has been identified. The venue will contact you directly.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Claim Details */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Claim Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Item Description</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{claim.userDescription}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{claim.contactInfo}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">What happens next?</h2>
          <div className="space-y-3 text-blue-800">
            {claim.status === 'pending' && (
              <>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4" />
                  <span>Our AI will search for matching items in venue databases</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4" />
                  <span>You'll receive an email notification when we have an update</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4" />
                  <span>If a match is found, the venue will contact you directly</span>
                </div>
              </>
            )}
            
            {claim.status === 'verified' && (
              <>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4" />
                  <span>The venue will contact you using the information you provided</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4" />
                  <span>You'll need to verify your identity when picking up the item</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4" />
                  <span>Bring a valid ID and be prepared to answer verification questions</span>
                </div>
              </>
            )}
            
            {claim.status === 'rejected' && (
              <>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4" />
                  <span>Check back periodically as new items are added daily</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4" />
                  <span>Consider submitting a new claim with different details</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4" />
                  <span>Contact venues directly if you know where you lost the item</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Return Home
          </Link>
          <Link
            to="/claim"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors text-center"
          >
            Submit Another Claim
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ClaimConfirmation;
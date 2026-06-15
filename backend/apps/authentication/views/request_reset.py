import uuid
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.authentication.serializers import RequestResetSerializer


class RequestResetView(APIView):
    serializer_class = RequestResetSerializer

    @extend_schema(tags=['Autenticação'])
    def post(self, request):
        serializer = RequestResetSerializer(data=request.data, context={})
        serializer.is_valid(raise_exception=True)
        user = serializer.context['user']
        user.activation_token = uuid.uuid4()
        user.save()
        # TODO: send reset email with token
        return Response({'detail': 'Password reset link sent to your email.'})

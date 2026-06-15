import uuid
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.authentication.serializers import RequestAccessSerializer


class RequestAccessView(APIView):
    serializer_class = RequestAccessSerializer

    @extend_schema(tags=['Autenticação'])
    def post(self, request):
        serializer = RequestAccessSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(activation_token=uuid.uuid4(), is_active=False)
        # TODO: send activation email with token
        return Response(
            {'detail': 'Access request submitted. The user will receive an activation link.'},
            status=status.HTTP_201_CREATED,
        )

from rest_framework import serializers

from .models import Account, Transaction


# ============================================================
# ACCOUNT SERIALIZER
# ============================================================

class AccountSerializer(serializers.ModelSerializer):
    """
    Converts Account model data into JSON.

    Includes the related user's details so the frontend
    can display the correct account holder name.
    """

    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    first_name = serializers.CharField(
        source="user.first_name",
        read_only=True
    )

    last_name = serializers.CharField(
        source="user.last_name",
        read_only=True
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Account

        fields = [
            "id",
            "user",
            "username",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "account_number",
            "balance",
        ]

        read_only_fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "balance",
        ]

    def get_full_name(self, obj):
        """
        Returns the user's full name.

        If the user has no first or last name,
        the username will be displayed instead.
        """

        first_name = obj.user.first_name.strip()
        last_name = obj.user.last_name.strip()

        full_name = f"{first_name} {last_name}".strip()

        if full_name:
            return full_name

        return obj.user.username


# ============================================================
# TRANSACTION SERIALIZER
# ============================================================

class TransactionSerializer(serializers.ModelSerializer):
    """
    Converts Transaction model data into JSON.

    The authenticated user is assigned in the view.
    """

    class Meta:
        model = Transaction

        fields = "_all_"

        read_only_fields = [
            "id",
            "user",
        ]
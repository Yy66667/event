from typing import Any


def strip_mongo_id(document: dict[str, Any]) -> dict[str, Any]:
    """Remove Mongo's internal identifier before returning a document."""
    document.pop("_id", None)
    return document

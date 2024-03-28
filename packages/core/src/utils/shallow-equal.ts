export const shallowEqual = (value: unknown, other: unknown): boolean => {
	if (value === other) {
		return true;
	}

	if (!(typeof value === "object" && value !== null) || !(typeof other === "object" && other !== null)) {
		return false;
	}

	if (Array.isArray(value) && Array.isArray(other)) {
		if (value.length !== other.length) {
			return false;
		}

		for (let i = 0; i < value.length; i++) {
			if (value[i] !== other[i]) {
				return false;
			}
		}
		return true;
	}

	if (Array.isArray(value) || Array.isArray(other)) {
		return false;
	}

	const valueKeys = Object.keys(value as Record<string, unknown>);
	const otherKeys = Object.keys(other as Record<string, unknown>);

	if (valueKeys.length !== otherKeys.length) {
		return false;
	}

	for (const key of valueKeys) {
		if (!(key in other) || (value as Record<string, unknown>)[key] !== (other as Record<string, unknown>)[key]) {
			return false;
		}
	}

	return true;
};

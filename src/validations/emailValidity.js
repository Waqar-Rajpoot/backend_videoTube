function isValidEmail(email) {
  const localPart = email.split("@")[0];
  const domainPart = email.split("@")[1];

  if (email.indexOf("@") === -1) {
    return false;
  }
  if (
    [!localPart || !domainPart, domainPart.indexOf(".") === -1].some(
      (val) => val === true
    )
  ) {
    return false;
  } else {
    return true;
  }
}

export { isValidEmail };
